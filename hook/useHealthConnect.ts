import { useCallback, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions,
} from 'react-native-health-connect';
import { Permission } from 'react-native-health-connect/lib/typescript/types';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const RECORD_TYPES = {
  STEPS: 'Steps',
  HEART_RATE: 'HeartRate',
  CALORIES: 'ActiveCaloriesBurned',
  SLEEP: 'SleepSession',
} as const;

const REQUIRED_PERMISSIONS: Permission[] = [
  { accessType: 'read', recordType: RECORD_TYPES.STEPS },
  { accessType: 'read', recordType: RECORD_TYPES.HEART_RATE },
  { accessType: 'read', recordType: RECORD_TYPES.CALORIES },
  { accessType: 'read', recordType: RECORD_TYPES.SLEEP },
];

const useHealthConnect = () => {
  const [data, setData] = useState({
    steps: 0,
    calories: 0,
    heartRate: 0,
    sleep: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const hasAllPermissions = useCallback(() => {
    return REQUIRED_PERMISSIONS.every((req) =>
      permissions.some(
        (p) => p.recordType === req.recordType && p.accessType === req.accessType
      )
    );
  }, [permissions]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const init = async () => {
      try {
        const initialized = await initialize();
        if (!initialized) {
          setError('Failed to initialize Health Connect');
          return;
        }
        setIsInitialized(true);
        
        // Fetch granted permissions after initialization
        const granted = await getGrantedPermissions();
        setPermissions(granted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Initialization failed');
      }
    };
    init();
  }, []);

  const requestPermissions = useCallback(async () => {
    if (!isInitialized) {
      setError('Health Connect not initialized');
      return { success: false, granted: [] };
    }
    try {
      const granted = await requestPermission(REQUIRED_PERMISSIONS);
      setPermissions(granted);
      
      const hasPerms = REQUIRED_PERMISSIONS.every((req) =>
        granted.some(
          (p) => p.recordType === req.recordType && p.accessType === req.accessType
        )
      );
      
      setError(hasPerms ? null : 'Some permissions denied');
      return { success: hasPerms, granted };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission request failed');
      return { success: false, granted: [] };
    }
  }, [isInitialized]);

  const fetchData = useCallback(async (grantedPermissions?: Permission[]) => {
    // Use provided permissions or fall back to state
    const permsToCheck = grantedPermissions || permissions;
    const hasPerms = REQUIRED_PERMISSIONS.every((req) =>
      permsToCheck.some(
        (p) => p.recordType === req.recordType && p.accessType === req.accessType
      )
    );

    if (!isInitialized || !hasPerms) {
      setError('Permissions or initialization missing');
      return;
    }

    try {
      setError(null);
      setSuccess(false);

      const today = new Date();
      const startTime = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const endTime = today.toISOString();
      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime,
        endTime,
      };

      // CRITICAL FIX: readRecords returns { records: [...] }, not an array directly
      
      // Steps: total count
      const stepsResult = await readRecords(RECORD_TYPES.STEPS, { timeRangeFilter });
      const stepsRecords = stepsResult.records || [];
      const totalSteps = stepsRecords.reduce((sum, cur) => sum + (cur.count || 0), 0);
      console.log('Steps records:', stepsRecords.length, 'Total:', totalSteps);

      // Calories burned: total kcal
      const caloriesResult = await readRecords(RECORD_TYPES.CALORIES, { timeRangeFilter });
      const caloriesRecords = caloriesResult.records || [];
      const totalCalories = caloriesRecords.reduce(
        (sum, cur) => sum + (cur.energy?.inKilocalories || 0), 
        0
      );
      console.log('Calories records:', caloriesRecords.length, 'Total:', totalCalories);

      // Heart Rate: latest bpm
      const hrResult = await readRecords(RECORD_TYPES.HEART_RATE, { timeRangeFilter });
      const hrRecords = hrResult.records || [];
      let latestHeartRate = 0;
      if (hrRecords.length > 0) {
        const sorted = [...hrRecords].sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        latestHeartRate = sorted[0].beatsPerMinute || 0;
      }
      console.log('Heart Rate records:', hrRecords.length, 'Latest:', latestHeartRate);

      // Sleep: total minutes
      const sleepResult = await readRecords(RECORD_TYPES.SLEEP, { timeRangeFilter });
      const sleepRecords = sleepResult.records || [];
      const totalSleep = sleepRecords.reduce(
        (sum, cur) => {
          // Calculate duration from startTime and endTime if duration is not available
          if (cur.duration?.inMinutes) {
            return sum + cur.duration.inMinutes;
          } else if (cur.startTime && cur.endTime) {
            const start = new Date(cur.startTime).getTime();
            const end = new Date(cur.endTime).getTime();
            const minutes = (end - start) / (1000 * 60);
            return sum + minutes;
          }
          return sum;
        }, 
        0
      );
      console.log('Sleep records:', sleepRecords.length, 'Total:', totalSleep, 'minutes');

      setData({
        steps: totalSteps,
        calories: Math.round(totalCalories),
        heartRate: latestHeartRate,
        sleep: Math.round(totalSleep),
      });
      setDataTimestamp(endTime);
      setSuccess(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Fetch failed');
      setSuccess(false);
    }
  }, [isInitialized, permissions]);

  const triggerFetch = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setError('Health Connect is Android-only');
      return;
    }

    const hasPerms = hasAllPermissions();
    if (!hasPerms) {
      const result = await requestPermissions();
      if (!result.success) return;
      // Pass the newly granted permissions directly to fetchData
      await fetchData(result.granted);
    } else {
      await fetchData();
    }
  }, [hasAllPermissions, requestPermissions, fetchData]);

  const revokeAccess = useCallback(() => {
    setPermissions([]);
    setData({ steps: 0, calories: 0, heartRate: 0, sleep: 0 });
    setSuccess(false);
    setError(null);
    setDataTimestamp(null);
    Alert.alert(
      'Access Revoked',
      'Permissions cleared locally. To fully revoke, open the Health Connect app, go to "Apps using your data", and remove access for this app.'
    );
  }, []);

  useEffect(() => {
    setSuccess(false); // Reset success on permission change
  }, [permissions]);

  return {
    steps: data.steps,
    calories: data.calories,
    heartRate: data.heartRate,
    sleep: data.sleep,
    error,
    hasPermissions: hasAllPermissions(),
    success,
    dataTimestamp,
    onPress: triggerFetch,
    refetch: triggerFetch,
    revokeAccess,
  };
};

export default useHealthConnect;