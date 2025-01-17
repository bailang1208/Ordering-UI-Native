import * as React from 'react';
import { Alert, Linking, Pressable, TextStyle } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import OText from './OText';
import OButton from './OButton';

interface Props {
  url: string | undefined;
  shorcut: string;
  color?: string;
  PressStyle?: TextStyle;
  TextStyle?: TextStyle;
  type?: string;
  hasButton?: boolean;
}

const OLink = (props: Props): React.ReactElement => {
  const { url, shorcut, color, PressStyle, TextStyle, type, hasButton } = props;
  const [, t] = useLanguage();

  const handleAlert = () =>
    Alert.alert(
      t('ERROR_OPENING_THE_LINK', 'Error opening the link'),
      t('LINK_UNSUPPORTED', 'Link could not be opened or is not supported'),
      [
        {
          text: t('OK', 'Ok'),
        },
      ],
    );

  const handleOpenUrl = async (breakFunction = false) => {
    if(breakFunction) {
      return
    }
    if (!url) {
      handleAlert();
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        handleAlert();
      }
    } catch (err) {
      handleAlert();
    }
  };

  return (
    <Pressable style={PressStyle} onPress={() => handleOpenUrl(hasButton)}>
      {hasButton ? (
        <OButton
          onClick={() => handleOpenUrl()}
          text={shorcut} imgRightSrc=''
          textStyle={{color: 'white'}}
          style={{width: '100%', alignSelf: 'center', borderRadius: 10}}
        />
      ) : (
      <OText
        style={TextStyle}
        numberOfLines={1}
        ellipsizeMode="tail"
        color={color}>
        {shorcut}
      </OText>
      )}
    </Pressable>
  );
};

export default OLink;
