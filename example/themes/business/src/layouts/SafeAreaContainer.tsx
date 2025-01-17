import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import styled from 'styled-components/native';

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const SafeAreaContainerLayout = (props: any) => {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  return (
    <>
      <SafeAreaContainer>
        <View
          style={{
            paddingHorizontal: 30,
            paddingTop: 30,
            paddingBottom: 0,
            flex: 1,
          }}>
          <StatusBar
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
          />
          {props.children}
        </View>
      </SafeAreaContainer>
    </>
  );
};
