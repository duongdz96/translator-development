/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NativeAdView, {
  CallToActionView,
  HeadlineView,
  ImageView,
  TaglineView,
} from 'react-native-admob-native-ads';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const NativeAdsLanguage = React.memo(
  ({ dataAds, backgroundColor, color, mode }: any): JSX.Element => {
    const [aspectRatio, setAspectRatio] = useState(1.5);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const nativeAdRef = useRef<NativeAdView>(null);
    const [loadData, setLoadData] = useState({});

    useEffect(() => {
      nativeAdRef.current?.loadAd();
    }, []);
    const onAdFailedToLoad = (event: any) => {
      setError(true);
      setLoading(false);
      console.log('AD', 'FAILED', event);
    };

    const onAdLoaded = () => {
      console.log('AD', 'LOADED', 'Ad has loaded successfully');
    };

    const onAdClicked = () => {
      console.log('AD', 'CLICK', 'User has clicked the Ad');
    };
    const onAdImpression = () => {
      console.log('AD', 'IMPRESSION', 'Ad impression recorded');
    };

    const onNativeAdLoaded = (event: any) => {
      console.log('AD', 'RECIEVED', 'Unified ad  Recieved', event);
      setLoading(false);
      setLoaded(true);
      setError(false);
      setLoadData(event);
    };

    const onAdLeftApplication = () => {
      console.log('AD', 'LEFT', 'Ad left application');
    };

    return (
      <View>
        {!error && (
          <>
            <View
              style={{
                backgroundColor: '#2665EF',
                position: 'absolute',
                zIndex: 2,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <Text
                style={{
                  paddingHorizontal: 3,
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: 12,
                }}>
                Ad
              </Text>
            </View>
            <NativeAdView
              ref={nativeAdRef}
              onAdLoaded={onAdLoaded}
              onAdFailedToLoad={onAdFailedToLoad}
              onAdLeftApplication={onAdLeftApplication}
              onAdClicked={onAdClicked}
              onAdImpression={onAdImpression}
              onNativeAdLoaded={onNativeAdLoaded}
              refreshInterval={60000 * 2}
              style={{
                width: '100%',
                alignSelf: 'center',
                backgroundColor: backgroundColor ? backgroundColor : '',
                borderRadius: 12,
              }}
              videoOptions={{
                customControlsRequested: true,
              }}
              mediationOptions={{
                nativeBanner: true,
              }}
              adUnitID={dataAds} // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
            >
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    left: 5,
                    alignItems: 'center',
                    opacity: !loading && !error && loaded ? 0 : 1,
                    zIndex: !loading && !error && loaded ? 0 : 10,
                  }}>
                  {loading && (
                    <View style={{ paddingLeft: 14, zIndex: 100 }}>
                      <ShimmerPlaceholder
                        width={Dimensions.get('window').width}
                        height={230}
                      />
                    </View>
                  )}
                </View>
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    opacity: loading || error || !loaded ? 0 : 1,
                    maxWidth: '100%',
                  }}>
                  <ImageView
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 12,
                      flexShrink: 1,
                    }}>
                    <HeadlineView
                      style={{
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: '#000000',
                        marginBottom: 4,
                      }}
                    />
                    <TaglineView
                      numberOfLines={2}
                      style={{
                        fontSize: 11,
                        color: '#000000',
                      }}
                    />
                  </View>
                </View>
                <ImageView
                  style={{ height: 109, width: 163, marginBottom: 12 }}
                />
                <CallToActionView
                  style={[
                    {
                      height: 40,
                      width: Dimensions.get('screen').width - 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 12,
                    },
                    Platform.OS === 'ios'
                      ? {
                          backgroundColor: backgroundColor
                            ? backgroundColor
                            : '#fff',
                          borderRadius: 40,
                        }
                      : {},
                  ]}
                  buttonAndroidStyle={{
                    backgroundColor: '#2665EF',
                    borderRadius: 40,
                  }}
                  allCaps
                  textStyle={{
                    fontSize: 16,
                    fontWeight: '600',
                    flexWrap: 'wrap',
                    color: color ? color : 'rgba(0, 0, 0, 1)',
                    paddingBottom: 12,
                  }}
                />
              </View>
            </NativeAdView>
          </>
        )}
      </View>
    );
  },
);
export default NativeAdsLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
