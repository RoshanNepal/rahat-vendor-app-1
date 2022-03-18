import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {useBackHandler} from '@react-native-community/hooks';

import {
  CustomButton,
  CustomHeader,
  RegularText,
  SmallText,
} from '../../components';
import {storeUserData} from '../../redux/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const BackupMnemonicScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {wallet} = useSelector(state => state.wallet);
  const data = route?.params?.data;
  // const secretWords = wallet?._mnemonic().phrase.split(' ');
  const [secretWords, setSecretWords] = useState([]);
  // const secretWords = ['asd', 'bsd'];

  useEffect(() => {
    AsyncStorage.getItem('walletInfo')
      .then(item => {
        if (item !== null) {
          let temp = JSON.parse(item)?.mnemonic?.split(' ');
          setSecretWords(temp);
        }
      })
      .catch(e => {
        alert(e);
      });
  }, []);

  useBackHandler(() => {
    if (data) {
      dispatch(storeUserData(data, registerSuccess));
      return true;
    }
    return false;
  });

  const WordComponent = ({count, secret}) => (
    <View style={styles.wordView}>
      <SmallText noPadding style={{paddingTop: Spacing.vs / 2}}>
        {t('Word')}: {`${t(count)}`}
      </SmallText>
      <RegularText color={colors.black}>{secret}</RegularText>
    </View>
  );

  // const registerSuccess = () => {
  //   navigation.replace('Tabs');
  // };

  const handleButtonClick = () => {
    navigation.pop();
  };

  return (
    <>
      <CustomHeader
        title={t('Backup Wallet')}
        hideBackButton={!!data}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <SmallText>
          {t(
            'Here is your 12 words secret. Please write down these words in sequence (using the word number) and store safely',
          )}
        </SmallText>

        {secretWords.map((item, index) => (
          <WordComponent key={index} count={index + 1} secret={item} />
        ))}

        <CustomButton
          title={t('I have written it down')}
          onPress={handleButtonClick}
          style={styles.button}
        />
      </ScrollView>
    </>
  );
};

export default BackupMnemonicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  wordView: {
    height: hp(9),
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.hs,
    marginBottom: Spacing.vs * 1.5,
  },
  button: {marginBottom: Spacing.vs},
});
