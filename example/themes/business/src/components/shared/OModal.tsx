import * as React from 'react';
import { Modal, StyleSheet, Text, SafeAreaView, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import OIcon from './OIcon';
import OIconButton from './OIconButton';
import { useTheme } from 'styled-components/native';

interface Props {
  open?: boolean;
  title?: string;
  children?: any;
  onAccept?: any;
  onCancel?: any;
  onClose?: any;
  style?: any;
  acceptText?: string;
  cancelText?: string;
  isTransparent?: boolean;
  hideCloseDefault?: boolean;
  entireModal?: boolean;
  customClose?: boolean;
  titleSectionStyle?: any;
  isNotDecoration?: boolean;
  styleCloseButton?: any;
  order?: any;
}

const OModal = (props: Props): React.ReactElement => {
  const {
    open,
    title,
    children,
    onAccept,
    onCancel,
    onClose,
    acceptText,
    cancelText,
    isTransparent,
    hideCloseDefault,
    entireModal,
    customClose,
    titleSectionStyle,
    isNotDecoration,
    style,
    styleCloseButton,
    order,
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
    },
    titleSection: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      height: 75,
      borderBottomWidth: 2,
      borderBottomColor: '#e6e6e6',
    },
    titleGroups: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    titleIcons: {
      height: 32,
      width: 32,
      borderRadius: 7.6,
    },
    shadow: {
      height: 33,
      width: 33,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7.6,
      marginLeft: 15,
      elevation: 1,
      shadowColor: theme.colors.shadow,
    },
    cancelBtn: {
      marginRight: 5,
      zIndex: 10000,
      height: 30,
      width: 20,
    },
    modalText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 20,
      color: theme.colors.textGray,
      textAlign: 'center',
      zIndex: 10,
    },
    wrapperIcon: {
      overflow: 'hidden',
      borderRadius: 50,
      backgroundColor: '#CCCCCC80',
      width: 35,
      margin: 15,
    },

    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => {
        onClose();
      }}
      style={{
        height: '100%',
        flex: 1,
        position: 'absolute',
        ...style,
        zIndex: 9999,
      }}>
      <SafeAreaView style={styles.container}>
        {!entireModal ? (
          <View style={styles.centeredView}>
            <View
              style={
                titleSectionStyle ? titleSectionStyle : styles.titleSection
              }>
              <View style={styles.wrapperIcon}>
                <Icon
                  name="x"
                  size={35}
                  style={
                    isNotDecoration && (styleCloseButton || styles.cancelBtn)
                  }
                  onPress={onClose}
                />
              </View>
              <Text style={styles.modalText}>{title}</Text>
            </View>
            {children}
          </View>
        ) : (
          <>
            {!customClose && (
              <View style={styles.titleSection}>
                <View style={styles.titleGroups}>
                  <OIconButton
                    icon={theme.images.general.arrow_left}
                    iconStyle={{ width: 23, height: 23 }}
                    borderColor={theme.colors.clear}
                    style={styleCloseButton || styles.cancelBtn}
                    onClick={onClose}
                  />

                  <Text style={styles.modalText}>{title}</Text>
                </View>
                <View style={styles.titleGroups}>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.business?.logo}
                      style={styles.titleIcons}
                    />
                  </View>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.customer?.photo}
                      style={styles.titleIcons}
                    />
                  </View>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.driver?.photo}
                      style={styles.titleIcons}
                    />
                  </View>
                </View>
              </View>
            )}
            {children}
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default OModal;