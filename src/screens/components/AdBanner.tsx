/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import ShimmerPlaceholder from '../../screens/components/ShimmerPlaceholder';

const AdBanner = () => {
  const [isError, setIsError] = useState(false);
  const ID_BANNER_ALL =
    (Platform?.OS === 'ios' ? Config?.IOS_BANNER : Config?.ANDROID_BANNER) ||
    '';

  return (
    <View>
      <View style={styles.container}>
        <ShimmerPlaceholder
          width={Dimensions.get('window').width}
          height={60}
        />
        {!isError && (
          <View
            style={{
              position: 'absolute',
              zIndex: 10,
            }}>
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId={ID_BANNER_ALL}
              onAdLoaded={() => {
                setIsError(false);
              }}
              onAdFailedToLoad={(error) => {
                console.error('Ad failed to load', error);
                setIsError(true);
              }}
            />
          </View>
        )}
        {/* )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
});

export default AdBanner;
