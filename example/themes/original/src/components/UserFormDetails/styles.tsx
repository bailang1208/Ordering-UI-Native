import styled from 'styled-components/native';

export const UDForm = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

export const UDWrapper = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

export const UDLoader = styled.View`
  width: 100%;
  justify-content: center;
  height: auto;
  display: inline-flex;
  flex-wrap: wrap;
  padding: 0;
  margin-top: 0px;
`

export const WrapperPhone = styled.View`
  margin-bottom: 25px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`
