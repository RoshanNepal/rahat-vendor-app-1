import React, {useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {RumsanLogo} from '../../../assets/icons';
import {useIsFocused} from '@react-navigation/native';
import {PoppinsMedium, RegularText, CustomPopup} from '../../components';
import {ethers} from 'ethers';
import {useTranslation} from 'react-i18next';

const ScanScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const {type} = route.params;

  const [values, setValues] = useState({
    showPopup: false,
    popupType: '',
    messageType: '',
    message: '',
  });
  const {message, messageType, popupType, showPopup} = values;

  const onChargeScan = res => {
    let phone, amount;
    const details = res.data.split('?');
    const phoneDetails = details[0]?.split(':');
    const amountDetails = details[1]?.split('=');
    if (phoneDetails[0] !== 'phone' || amountDetails[0] !== 'amount') {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: `${t('Error')}`,
        message: `${t('Invalid QR code')}`,
      });
    }
    if (phoneDetails[0] === 'phone') {
      phone = phoneDetails[1].substr(4, phoneDetails[1]?.length);
    }
    if (amountDetails[0] === 'amount') {
      amount = amountDetails[1];
    }

    if (phone !== undefined && amount !== undefined) {
      navigation.navigate('ChargeDrawerScreen', {phone, amount});
    }
  };

  const onTransferScan = res => {
    let data = res.data;
    const temp = ethers?.utils.isAddress(data);
    if (!ethers?.utils.isAddress(data)) {
      setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: `${t('Error')}`,
        message: `${t('Invalid QR code')}`,
      });
      return;
    }
    navigation.navigate('TransferTokenScreen', {
      destinationAddress: data,
      fromScan: true,
    });
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
      )}

      <CustomPopup
        show={showPopup}
        popupType={popupType}
        messageType={messageType}
        message={message}
        onConfirm={() => setValues({...values, showPopup: false})}
      />

      {!showPopup && (
        <QRCodeScanner
          cameraStyle={{height: '100%', backgroundColor: colors.blue}}
          showMarker
          markerStyle={{borderColor: colors.blue}}
          reactivate
          onRead={type === 'Charge' ? onChargeScan : onTransferScan}
        />
      )}

      {/* <View style={styles.top} />
      <View style={styles.side} />
      <View style={[styles.side, {right: 0}]} />
      <View style={styles.bottom} /> */}

      <View style={styles.alignCenter}>
        <PoppinsMedium
          color={colors.white}
          fontSize={FontSize.large * 1.2}
          style={{textAlign: 'center', top: 30}}>
          {t('Scan')} & {type}
        </PoppinsMedium>

        <PoppinsMedium
          color={colors.white}
          fontSize={FontSize.small / 1.1}
          style={styles.text}>
          {t('Please align the QR code within the frame')}
        </PoppinsMedium>
      </View>

      <View style={styles.poweredByView}>
        <RegularText
          color={colors.white}
          style={{
            textAlign: 'center',
            paddingHorizontal: Spacing.hs / 3,
            fontSize: FontSize.small,
          }}>
          {t('Powered By')}
        </RegularText>
        <RumsanLogo />
      </View>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: hp(35),
    width: wp(100),
    position: 'absolute',
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    height: hp(39.35),
    width: wp(100),
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  side: {
    top: hp(35),
    height: hp(32),
    width: wp(22),
    position: 'absolute',
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  alignCenter: {
    position: 'absolute',
    left: 0,
    top: 40,
    right: 0,
  },
  text: {textAlign: 'center', top: 25},
  buttonView: {position: 'absolute', bottom: 120, left: 0, right: 0},
  poweredByView: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    right: 0,
    left: 0,
  },
});
