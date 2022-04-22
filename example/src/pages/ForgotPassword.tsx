import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  ForgotPasswordForm,
  Container,
} from '../../themes/original';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ForgotPassword = (props: any) => {
  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container>
        <ForgotPasswordForm {...props} />
      </Container>
    </KeyboardView>
  );
};

export default ForgotPassword;