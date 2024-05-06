// components/LoaderOverlay.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Portal, Modal } from 'react-native-paper';

export default function LoaderOverlayX({ visible }) {
  return (
    <Portal>
      <Modal visible={true} dismissable={false} contentContainerStyle={styles.modal}>
        <ActivityIndicator size="large" color='#000' />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    backgroundColor: 'white',
  },
});
