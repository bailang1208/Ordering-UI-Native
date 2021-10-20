import React, { useState, useEffect, useCallback } from 'react'
import { useEvent, useLanguage } from 'ordering-components/native'
import { View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { NotificationContainer } from './styles'
import Sound from 'react-native-sound'

Sound.setCategory('Playback')

const windowWidth = Dimensions.get('screen').width

export const NewOrderNotification = (props: any) => {
  const [events] = useEvent()
  const theme = useTheme()
  const [, t] = useLanguage()

  const [modalOpen, setModalOpen] = useState(false)
  const [newOrderIds, setNewOrderIds] = useState<Array<any>>([])
  const [soundTimeout, setSoundTimeout] = useState<any>(null)

  const notificationSound = new Sound(theme.sounds.notification, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return
    }
    console.log('loaded successfully');
  });


  const handlePlayNotificationSound = () => {
    const _timeout = setInterval(function () {
      notificationSound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      })
      setSoundTimeout(_timeout)
    }, 2500)
  }

  const handleCloseModal = () => {
    clearInterval(soundTimeout)
    setModalOpen(false)
    setNewOrderIds([])
  }

  const handleNotification = useCallback((order: any) => {
    clearInterval(soundTimeout)
    handlePlayNotificationSound()
    setModalOpen(true)
    setNewOrderIds([...newOrderIds, order.id])
  }, [newOrderIds, notificationSound, soundTimeout])

  useEffect(() => {
    events.on('order_added', handleNotification)
    return () => {
      events.off('order_added', handleNotification)
    }
  }, [handleNotification])

  useEffect(() => {
    notificationSound.setVolume(1);
    return () => {
      notificationSound.release();
    }
  }, [])

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalOpen}
      >
        <NotificationContainer>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.wrapperIcon}
              onPress={() => handleCloseModal()}
            >
              <Icon
                name="x"
                size={30}
              />
            </TouchableOpacity>
            <OText
              size={18}
              color={theme.colors.textGray}
              weight={600}
            >
              {t('NEW_ORDRES_RECEIVED', 'New orders have been received!')}
            </OText>
            <OIcon
              src={theme.images.general.newOrder}
              width={250}
              height={200}
            />
            {newOrderIds.map(orderId => (
              <OText
                key={orderId}
                color={theme.colors.textGray}
                mBottom={15}
              >
                {t('ORDER_N_ORDERED', 'Order #_order_id_ has been ordered.').replace('_order_id_', orderId)}
              </OText>
            ))}
          </View>
        </NotificationContainer>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
    maxWidth: windowWidth - 60,
  },
  wrapperIcon: {
    position: 'absolute',
    right: 20,
    top: 20
  }
})