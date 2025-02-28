import React from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, Pressable, Image} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {AngleRightIcon, RedeemIcon} from '../../../../assets/icons';
import colors from '../../../../constants/colors';
import {FontSize, Spacing} from '../../../../constants/utils';
import {CustomHeader, Card, RegularText, SmallText} from '../../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}
const AmountWithAngleBracket = ({amount}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <RegularText
      color={colors.blue}
      style={{
        fontSize: FontSize.medium * 1.1,
        paddingHorizontal: Spacing.hs / 2,
      }}>
      {amount}
    </RegularText>
    <AngleRightIcon />
  </View>
);

const IndividualPackageView = ({imageHash, title, amount, onPress}) => (
  <Pressable onPress={onPress}>
    <View style={styles.individualPackageDetail}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: `https://ipfs.rumsan.com/ipfs/${imageHash}`}}
          style={{
            height: heightPercentageToDP(3),
            width: widthPercentageToDP(8),
          }}
        />
        <RegularText
          color={colors.gray}
          style={{
            fontSize: FontSize.medium * 1.1,
            paddingHorizontal: Spacing.hs,
          }}>
          {title}
        </RegularText>
      </View>
      <AmountWithAngleBracket amount={amount} />
    </View>
  </Pressable>
);

const ChargeScreen = ({navigation, route}) => {
  const {tokenBalance, packages, beneficiaryPhone} = route.params;
  const {t} = useTranslation();
  const {activeAppSettings} = useSelector(state => state.agency);

  return (
    <>
      <CustomHeader title={t('Charge')} hideBackButton />

      <View style={styles.container}>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          {t('Charge To')} :
        </SmallText>
        <Pressable
          onPress={() =>
            navigation.navigate('ChargeTokenScreen', {
              tokenBalance,
              beneficiaryPhone,
            })
          }>
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.gray}
              style={{fontSize: FontSize.medium * 1.1}}>
              {t('Token Balance')}:
            </RegularText>
            <AmountWithAngleBracket amount={tokenBalance} />
          </Card>
        </Pressable>
        <Card style={{paddingVertical: Spacing.vs * 2}}>
          <RegularText
            color={colors.gray}
            style={{fontSize: FontSize.medium * 1.1}}>
            {t('Packages')}:
          </RegularText>
          {packages.map(item => (
            <IndividualPackageView
              key={item.tokenId}
              imageHash={item.imageUri}
              title={item.name}
              amount={item.balance}
              onPress={() =>
                navigation.navigate('ChargePackageScreen', {
                  packageDetail: item,
                  beneficiaryPhone,
                })
              }
            />
          ))}
        </Card>
      </View>
    </>
  );
};

export default ChargeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  tokenDetailCard: {
    paddingVertical: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  individualPackageDetail: {
    paddingTop: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
