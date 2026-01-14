import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Client } from '@ascencio/shared/interfaces';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId?: string;
  onClientSelect: (clientId: string | undefined) => void;
  onManualMode: (enabled: boolean) => void;
  isManualMode: boolean;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClientId,
  onClientSelect,
  onManualMode,
  isManualMode,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery),
  );

  const handleSelectClient = (client: Client) => {
    onClientSelect(client.id);
    onManualMode(false);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleManualEntry = () => {
    onClientSelect(undefined);
    onManualMode(true);
    setShowDropdown(false);
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Header with toggle */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
          {t('billTo')}
        </ThemedText>
        <TouchableOpacity
          onPress={() => onManualMode(!isManualMode)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: isManualMode ? theme.colors.primary : theme.colors.gray[100],
            borderRadius: 8,
          }}
        >
          <Ionicons
            name={isManualMode ? 'create-outline' : 'search-outline'}
            size={16}
            color={isManualMode ? '#fff' : theme.colors.gray[600]}
          />
          <ThemedText
            style={{
              fontSize: 12,
              color: isManualMode ? '#fff' : theme.colors.gray[600],
              fontWeight: '500',
            }}
          >
            {isManualMode ? t('manualEntry') : t('searchClient')}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search/Select Client */}
      {!isManualMode && (
        <View>
          {selectedClient ? (
            <View
              style={{
                padding: 12,
                backgroundColor: theme.colors.gray[50],
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.gray[200],
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                  {selectedClient.fullName}
                </ThemedText>
                <ThemedText style={{ fontSize: 14, color: theme.colors.gray[600] }}>
                  {selectedClient.email}
                </ThemedText>
                {selectedClient.phone && (
                  <ThemedText style={{ fontSize: 14, color: theme.colors.gray[600] }}>
                    {selectedClient.phone}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  onClientSelect(undefined);
                  setShowDropdown(true);
                }}
                style={{ padding: 8 }}
              >
                <Ionicons name="close-circle" size={24} color={theme.colors.gray[400]} />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => setShowDropdown(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.gray[300],
                  gap: 8,
                }}
              >
                <Ionicons name="search" size={20} color={theme.colors.gray[400]} />
                <ThemedText style={{ flex: 1, color: theme.colors.gray[500] }}>
                  {t('searchOrSelectClient')}
                </ThemedText>
                <Ionicons name="chevron-down" size={20} color={theme.colors.gray[400]} />
              </TouchableOpacity>

              {/* Dropdown Modal */}
              <Modal
                visible={showDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={1}
                  onPress={() => setShowDropdown(false)}
                >
                  <View
                    style={{
                      width: '90%',
                      maxHeight: '80%',
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      padding: 16,
                    }}
                    onStartShouldSetResponder={() => true}
                  >
                    {/* Search Input */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: theme.colors.gray[50],
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        marginBottom: 12,
                      }}
                    >
                      <Ionicons name="search" size={20} color={theme.colors.gray[400]} />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={t('searchByNameEmailPhone')}
                        style={{
                          flex: 1,
                          padding: 12,
                          fontSize: 16,
                        }}
                        autoFocus
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                          <Ionicons name="close-circle" size={20} color={theme.colors.gray[400]} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Manual Entry Option */}
                    <TouchableOpacity
                      onPress={handleManualEntry}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        backgroundColor: theme.colors.primary + '10',
                        borderRadius: 8,
                        marginBottom: 12,
                        gap: 8,
                      }}
                    >
                      <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                      <ThemedText style={{ flex: 1, fontWeight: '600', color: theme.colors.primary }}>
                        {t('enterClientManually')}
                      </ThemedText>
                    </TouchableOpacity>

                    {/* Client List */}
                    <FlatList
                      data={filteredClients}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleSelectClient(item)}
                          style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.gray[100],
                          }}
                        >
                          <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                            {item.fullName}
                          </ThemedText>
                          <ThemedText style={{ fontSize: 14, color: theme.colors.gray[600] }}>
                            {item.email}
                          </ThemedText>
                          {item.phone && (
                            <ThemedText style={{ fontSize: 14, color: theme.colors.gray[600] }}>
                              {item.phone}
                            </ThemedText>
                          )}
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <View style={{ padding: 20, alignItems: 'center' }}>
                          <Ionicons name="search-outline" size={48} color={theme.colors.gray[300]} />
                          <ThemedText style={{ marginTop: 12, color: theme.colors.gray[500] }}>
                            {t('noClientsFound')}
                          </ThemedText>
                        </View>
                      }
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
