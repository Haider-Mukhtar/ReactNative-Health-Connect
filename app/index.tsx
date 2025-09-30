import useHealthConnect from '@/hook/useHealthConnect';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Index() {
  const {
    steps,
    calories,
    heartRate,
    sleep,
    error,
    hasPermissions,
    success,
    dataTimestamp,
    onPress: triggerFetch,
    refetch,
    revokeAccess,
  } = useHealthConnect();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleInitialSync = async () => {
    if (!hasPermissions) {
      setShowPermissionModal(true);
    }
    await triggerFetch();
  };

  const sleepHours = (sleep / 60).toFixed(1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="white" />
          <Text style={styles.headerTitle}>Health Connect</Text>
        </View>
        {dataTimestamp && (
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(dataTimestamp).toLocaleString()}
          </Text>
        )}
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* No Permission State */}
        {!hasPermissions && !error && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="shield-lock-outline" size={80} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>Permission Required</Text>
            <Text style={styles.emptyDescription}>
              Grant access to Health Connect to view your health data
            </Text>
            <Pressable style={styles.primaryButton} onPress={handleInitialSync}>
              <MaterialCommunityIcons name="shield-check" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Grant Access</Text>
            </Pressable>
          </View>
        )}

        {/* No Data State */}
        {hasPermissions && success && steps === 0 && calories === 0 && heartRate === 0 && sleep === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="database-off-outline" size={80} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptyDescription}>
              No health data found for the last 24 hours. Make sure your fitness tracker is syncing data.
            </Text>
          </View>
        )}

        {/* Data Cards */}
        {hasPermissions && (steps > 0 || calories > 0 || heartRate > 0 || sleep > 0) && (
          <View style={styles.cardsContainer}>
            {/* Steps Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <FontAwesome5 name="walking" size={28} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Steps</Text>
                  <Text style={styles.cardValue}>{steps.toLocaleString()}</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Calories Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <Ionicons name="flame" size={32} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Calories</Text>
                  <Text style={styles.cardValue}>{calories}</Text>
                  <Text style={styles.cardUnit}>kcal</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Heart Rate Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <MaterialCommunityIcons name="heart-pulse" size={32} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Heart Rate</Text>
                  <Text style={styles.cardValue}>{heartRate || '--'}</Text>
                  <Text style={styles.cardUnit}>bpm</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Sleep Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <Ionicons name="moon" size={28} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Sleep</Text>
                  <Text style={styles.cardValue}>{sleepHours}</Text>
                  <Text style={styles.cardUnit}>hours</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {hasPermissions && (
        <View style={styles.bottomActions}>
          <Pressable 
            style={[styles.actionButton, styles.refreshButton]} 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="refresh" size={20} color="white" />
            )}
            <Text style={styles.actionButtonText}>
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, styles.revokeButton]} 
            onPress={revokeAccess}
          >
            <MaterialCommunityIcons name="shield-off" size={20} color="white" />
            <Text style={styles.actionButtonText}>Revoke Access</Text>
          </Pressable>
        </View>
      )}

      {/* Permission Modal */}
      <Modal
        visible={showPermissionModal && !hasPermissions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons name="shield-check" size={64} color="#667eea" />
            </View>
            <Text style={styles.modalTitle}>Health Connect Access</Text>
            <Text style={styles.modalDescription}>
              This app needs permission to read your health data from Health Connect including:
            </Text>
            <View style={styles.permissionList}>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.permissionText}>Steps data</Text>
              </View>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.permissionText}>Calories burned</Text>
              </View>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.permissionText}>Heart rate</Text>
              </View>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.permissionText}>Sleep sessions</Text>
              </View>
            </View>
            <Pressable 
              style={styles.modalButton} 
              onPress={() => {
                setShowPermissionModal(false);
                triggerFetch();
              }}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
            <Pressable 
              style={styles.modalCancelButton} 
              onPress={() => setShowPermissionModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  lastUpdated: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  cardUnit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#667eea',
  },
  revokeButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionList: {
    alignSelf: 'stretch',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  permissionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modalButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelButton: {
    paddingVertical: 12,
  },
  modalCancelButtonText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
});