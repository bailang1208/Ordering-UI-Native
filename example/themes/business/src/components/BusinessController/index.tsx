import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { useTheme } from 'styled-components/native';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components/native';
import { Card, Information, Logo } from './styles';
import { OIcon, OText } from '../shared';
import { BusinessControllerParams } from '../../types';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
  const { businessState, updateBusiness, isUpdateStore, setIsUpdateStore } =
    props;

  const { loading, business, error } = businessState;

  const theme = useTheme();
  const [{ optimizeImage }] = useUtils();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();

  const [updatingBusiness, setUpdatingBusiness] = useState(false);

  const handleSwitch = () => {
    setUpdatingBusiness(true);
    setIsUpdateStore(true);

    updateBusiness &&
      updateBusiness(business?.id, { enabled: !business?.enabled });
  };

  useEffect(() => {
    if (updatingBusiness && !error) {
      showToast(
        ToastType.Info,
        business?.enabled
          ? t('ENABLED_BUSINESS', 'Enabled business')
          : t('DISABLED_BUSINESS', 'Disabled business'),
      );
    }

    if (error) {
      showToast(
        ToastType.Error,
        t('ERROR_UPDATING_BUSINESS', 'Error updating business'),
      );
    }

    setIsUpdateStore(false);
    setUpdatingBusiness(false);
  }, [business]);

  const styles = StyleSheet.create({
    icon: {
      borderRadius: 7.6,
      width: 70,
      height: 70,
    },
    logo: {
      padding: 2,
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1.5,
      },
      shadowOpacity: 0.21,
      shadowRadius: 3,
      elevation: 7,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    title: {
      fontWeight: '600',
      fontSize: 18,
      color: theme.colors.textGray,
    },
    address: {
      fontSize: 14,
      color: theme.colors.unselectText,
    },
  });

  return (
    <>
      {business && (
        <Card key={business?.id}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Logo style={styles.logo}>
              <OIcon
                url={optimizeImage(business?.logo, 'h_300,c_limit')}
                style={styles.icon}
              />
            </Logo>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <Information>
                <View style={styles.header}>
                  <OText style={styles.title} numberOfLines={1}>
                    {business?.name}
                  </OText>
                </View>

                <OText style={styles.address} numberOfLines={1}>
                  {business?.address}
                </OText>

                <OText style={styles.address} numberOfLines={1}>
                  {business?.zipcode}
                </OText>
              </Information>

              {loading && isUpdateStore ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <ToggleSwitch
                  isOn={business?.enabled}
                  onColor={theme.colors.primary}
                  offColor={theme.colors.offColor}
                  size="small"
                  onToggle={handleSwitch}
                  disabled={loading}
                  animationSpeed={200}
                />
              )}
            </View>
          </View>
        </Card>
      )}
    </>
  );
};

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    isDisabledInterval: true,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
