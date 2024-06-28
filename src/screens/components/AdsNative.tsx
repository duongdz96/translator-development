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

const NativeAds = React.memo(
  ({ dataAds, backgroundColor }: any): JSX.Element => {
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
      console.log('1111');
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
      <>
        <View
          style={{
            borderRadius: 8,
          }}>
          {!error && (
            <>
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
                  backgroundColor: '#EDEDED',
                  borderRadius: 12,
                }}
                videoOptions={{
                  customControlsRequested: true,
                }}
                mediationOptions={{
                  nativeBanner: true,
                }}
                adUnitID={'ca-app-pub-3940256099942544/2247696110'} // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
              >
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: 12,
                    borderColor: '#E1E1E1',
                    borderWidth: 1,
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
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '70%',
                        alignItems: 'center',
                      }}>
                      <ImageView
                        style={{
                          width: 42,
                          height: 42,
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
                            color: '#1D2433',
                            marginBottom: 4,
                          }}
                        />
                        <TaglineView
                          numberOfLines={2}
                          style={{
                            fontSize: 11,
                            color: '#1D2433',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        alignItems: 'center',
                      }}>
                      <CallToActionView
                        style={[
                          {
                            height: 36,
                            width: 104,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          Platform.OS === 'ios'
                            ? {
                                backgroundColor: backgroundColor
                                  ? backgroundColor
                                  : '#fff',
                                borderRadius: 12,
                              }
                            : {},
                        ]}
                        buttonAndroidStyle={{
                          backgroundColor: '#2665EF',
                          borderRadius: 12,
                        }}
                        allCaps
                        textStyle={{
                          fontSize: 16,
                          fontWeight: '500',
                          flexWrap: 'wrap',
                          color: 'white',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </NativeAdView>
            </>
          )}
        </View>
      </>
    );
  },
);
export default NativeAds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
