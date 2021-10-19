import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import {strings} from '../../../Locales/i18';
import {commonStyles, keys} from '../../../SupportingFIles/Constants';
import {CheckBox} from 'react-native-elements';
import {
  getUserCorrentLocation,
  calculateDistance,
  checkLocationPermission,
} from '../../../SupportingFIles/Utills';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {getInfluencerSortType} from '../../../SupportingFIles/Utills';
import Loader from '../../../SupportingFIles/Loader';

class SortInfluencer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lowthigh: 0,
      hightlow: 0,
      nearest: 0,
      tiktok:0,
      facebook:0,
      youtube:0,
      twitter:0,
      LinkedIn:0,
      clubHouse:0,
      twitch:0,
      lastActive: 0,
      latitude: null,
      longitude: null,
      loading: false,
    };
  }

  componentDidMount() {
    getInfluencerSortType().then((Sortby) => {
      if (Sortby == null) {
        this.props.InfluencerStore.setSortby(2)
        console.log("SORT TYPE INFLUENCE STORE",this.props.InfluencerStore.Sortby)
        this.setState({
          lowthigh: parseInt(0) === 2 ? 1 : 0,
          hightlow: parseInt(1) === 1 ? 1 : 0,
          nearest: parseInt(0) === 3 ? 1 : 0,
          lastActive: parseInt(0) === 4 ? 1 : 0
        })
      } else {
        this.props.InfluencerStore.setSortby(Number(Sortby));
        console.log(
          this.props.InfluencerStore.Sortby,
        );
        this.setState({
          lowthigh: parseInt(Sortby) === 2 ? 1 : 0,
          hightlow: parseInt(Sortby) === 1 ? 1 : 0,
          nearest: parseInt(Sortby) === 3 ? 1 : 0,
          lastActive: parseInt(Sortby) === 4 ? 1 : 0,
        });
      }
    });

    this.props.navigation.addListener('focus', async () => {

      //   try {
      //     const granted = await PermissionsAndroid.request(
      //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
      //             'title': 'Location Access Required',
      //             'message': 'This App needs to Access your location'
      //         }
      //     )
      //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //         //To Check, If Permission is granted
      //         this.getUserLocation();
      //     } else {
      //         alert("Permission Denied");
      //     }
      // } catch (err) {
      //         alert("err",err);
      // }
      // this.getLocation()

      const {Sortby} = this.props.InfluencerStore;
      if (Sortby === '') {
        this.setState({lowthigh: 0, hightlow: 1, nearest: 0, lastActive: 0});
      } else {
        this.setState({
          lowthigh: Sortby === 2 ? 1 : 0,
          hightlow: Sortby === 1 ? 1 : 0,
          nearest: Sortby === 3 ? 1 : 0,
          lastActive: Sortby === 4 ? 1 : 0,
        });
      }
    });
  }

  getLocation = async () => {
    const hasLocationPermission = await checkLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
          console.log(position);
           this.Apply(3)
        },
        (error) => {
          this.setState({loading: false});
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          // enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          // distanceFilter: 0,
          //forceRequestLocation: this.state.forceLocation,
          // showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };
  getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position);
        //this.setState({initialPosition});
        console.log('User Location: ', initialPosition);
        if (position.coords.latitude !== null) {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } else {
          getUserCorrentLocation();
        }
      },
      (error) => {
        console.log('User Location: ', error);

        return error;
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  resetFields() {
    const store = this.props.InfluencerStore;
    this.props.InfluencerStore.setSortby('2');
    this.setState({lowthigh: 0, hightlow: 0, nearest: 0, lastActive: 0});
    store.setInfluencerList(null);
    store.hasNextPage = 0;
    store.getInfluencerList();
  }

  render() {
    const store = this.props.InfluencerStore;
    console.log('this.props.InfluencerStore: ', store.Sortby);

    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Loader loading={this.state.loading} />
        {/* <SafeAreaView>
          <TouchableOpacity style={styles.backContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={images.FilterCross} />
          </TouchableOpacity>
        </SafeAreaView> */}

        <View style={{flex: 1}}>
          {/* <ScrollView> */}
          <View style={styles.topfilterContainer}>
            <TouchableOpacity style={{...commonStyles.campaignViewfilter}}>
              <Text
                style={{
                  ...commonStyles.LatoBold_14,
                  color: colors.app_black,
                  textTransform: 'capitalize',
                }}>
                {strings('Sort_by')}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, }} onPress={() => this.props.InfluencerStore.Sortby !== '' ? this.resetFields() : ''}>

                <Text style={{ ...commonStyles.LatoBold_16, color: colors.app_Blue, }}>{strings('Reset')}</Text>
              </TouchableOpacity> */}
          </View>
          <View style={{flexDirection: 'row', marginTop: metrics.dimen_5}}>
            {/* <View >
                <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(112, 129, 138, 1)', marginLeft: metrics.dimen_20 }}>{strings('Sort_by')}</Text>

              </View>
              <View style={{ flex: 1, marginLeft: 30, marginTop: 10 }}>
                <View style={[styles.sepratertwo]}></View>

              </View> */}
          </View>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              this.Apply(2);
              this.setState({
                lowthigh: false,
                hightlow: true,
                nearest: false,
                lastActive: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 2 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(2);
                this.setState({
                  lowthigh: false,
                  hightlow: true,
                  nearest: false,
                  lastActive: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              {strings('Most_Followers')}
            </Text>
          </TouchableOpacity>

          {/* <View style={{ marginTop: metrics.dimen_20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(61, 64, 70, 1)', marginTop: metrics.dimen_7, marginLeft: metrics.dimen_20 }}>{strings('Total_low_to_high')}</Text>

              <CheckBox
                checked={this.state.hightlow}
                textStyle={styles.radioTextStyle}
                checkedColor={colors.app_orange}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ borderWidth: 0, backgroundColor: colors.transparent, padding: 0 }}
                onPress={() => this.setState({ hightlow: this.state.hightlow ? false : true, lowthigh: false, nearest: false })}
              />
            </View> */}

          {/* <View style={{ marginTop: metrics.dimen_20, paddingHorizontal: metrics.dimen_20, flexDirection: 'row', justifyContent: 'space-between' }}>




            </View> */}
        

           <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(4);
              this.setState({
                lastActive: true,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 4 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(4);
                this.setState({
                  lastActive: true,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              {strings('Last_Active')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.setState({
                nearest: true,
                hightlow: false,
                lowthigh: false,
                lastActive: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
              this.Apply(3);
            }}>
            <CheckBox
              checked={this.props.Sortby === 3 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.setState({
                  nearest: true,
                  hightlow: false,
                  lowthigh: false,
                  lastActive: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
                this.Apply(3);
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              {strings('Nearest')}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(5);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:true,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 5 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(5);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:true,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
                
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Tiktok
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(6);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:true,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 6 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(6);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:true,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Facebook
            </Text>
          </TouchableOpacity>

           <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(7);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:true,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 7 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(7);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:true,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Youtube
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(8);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:true,
                LinkedIn:false,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 8 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(8);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:true,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Twitter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(9);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:true,
                clubHouse:false,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 9 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(9);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:true,
                  clubHouse:false,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Linked In
            </Text>
          </TouchableOpacity>

           <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(10);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:true,
                twitch:false,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 10 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(10);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:true,
                  twitch:false,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Club house
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: metrics.dimen_10, flexDirection: 'row'}}
            onPress={() => {
              this.Apply(11);
              this.setState({
                lastActive: false,
                hightlow: false,
                lowthigh: false,
                nearest: false,
                tiktok:false,
                facebook:false,
                youtube:false,
                twitter:false,
                LinkedIn:false,
                clubHouse:false,
                twitch:true,
              });
            }}>
            <CheckBox
              checked={this.props.Sortby === 11 ? true : false}
              textStyle={styles.radioTextStyle}
              checkedColor={colors.app_orange}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{
                borderWidth: 0,
                backgroundColor: colors.transparent,
                padding: 0,
                marginLeft: metrics.dimen_20,
              }}
              onPress={() => {
                this.Apply(11);
                this.setState({
                  lastActive: false,
                  hightlow: false,
                  lowthigh: false,
                  nearest: false,
                  tiktok:false,
                  facebook:false,
                  youtube:false,
                  twitter:false,
                  LinkedIn:false,
                  clubHouse:false,
                  twitch:true,
                });
              }}
            />
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(61, 64, 70, 1)',
                marginTop: metrics.dimen_7,
              }}>
              Twitch
            </Text>
          </TouchableOpacity> */}

          

          {/* </ScrollView> */}
          {/* <TouchableOpacity onPress={() => this.Apply()}>

            <Text style={[{ height: 80, backgroundColor: colors.app_Blue, color: 'white', textAlign: 'center', padding: metrics.dimen_20, fontSize: metrics.text_large, textTransform: 'uppercase' }]}>{strings('Apply')}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }

  Apply(sortBy) {
    this.setInfluencerSortType(sortBy);
    const store = this.props.InfluencerStore;
    store.setSortby(sortBy);
    console.log('this.state.latitude:', this.state.latitude);
    console.log('sortBy:', sortBy);

    // if (sortBy === 1) {
    //   store.setSortby(2)
    // }

    // if (sortBy === 2) {
    //   store.setSortby(1)
    // }
    // if (sortBy === 4) {
    //   store.setSortby(4)
    // }

    if (sortBy === 3) {
      if (this.state.latitude !== null) {
        console.log('CHECK@#@#@#@#@#@#');
        store.setSortby(3);
        store.setUserLocation(this.state.latitude, this.state.longitude);
        store.hasNextPage = 0;
        store.setInfluencerList(null);
        store.getInfluencerList();
        // store.navigation.goBack()
        store.setShowInfluencerPopup(false);

        // var influencerDataWithoutLocation = [...store.InfluencerList]
        // var influencerDataWithLocation = [...store.InfluencerList]

        // influencerDataWithoutLocation = influencerDataWithoutLocation.filter(obj => obj.latitude === null)
        // influencerDataWithLocation = influencerDataWithLocation.filter(obj => obj.latitude !== null)
        // influencerDataWithLocation = influencerDataWithLocation.sort((p1, p2) => {
        //   if (p1.latitude !== null && p2.latitude !== null) {
        //     console.log("p1.ownerId:", p1.ownerId)
        //     console.log("distance:", calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p1.latitude), parseFloat(p1.longitude)) -
        //       calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p2.latitude), parseFloat(p2.longitude)))

        //     return calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p1.latitude), parseFloat(p1.longitude)) -
        //       calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p2.latitude), parseFloat(p2.longitude))
        //   }
        //   else {
        //     return 1
        //   }
        // }
        // )
        // const combinedData = [...influencerDataWithLocation, ...influencerDataWithoutLocation];

        // console.log("influencerData:", combinedData)
        // store.setInfluencerList(combinedData)
        // this.props.navigation.goBack()
        // return
      } else {
        //this.getUserLocation()
        this.getLocation();
      }
    } else {
      store.hasNextPage = 0;
      store.setInfluencerList(null);
      store.getInfluencerList();
      store.setShowInfluencerPopup(false);

      // this.props.navigation.goBack()
    }
  }

  setInfluencerSortType = async (type) => {
    console.log('valueee1234', type);
    if (type !== 0) {
      try {
        await AsyncStorage.setItem(keys.influencerSortType, type.toString());
      } catch (error) {
        console.log('SAVING ERRROR TYPE', error);
      }
    } else {
      console.log('Failed==', 'No Influencee Sort type found');
    }
  };
}

export default inject('InfluencerStore')(observer(SortInfluencer));

const styles = StyleSheet.create({
  // backgroudImage: {
  //   width: metrics.width,
  //   height: metrics.height,
  // },
  topfilterContainer: {
    paddingHorizontal: metrics.dimen_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: metrics.dimen_15,
  },
  // countrycity: {
  //   paddingHorizontal: metrics.dimen_20,
  //   flexDirection: "row",
  //   justifyContent: 'space-between',
  //   marginTop: metrics.dimen_15
  // },
  backContainer: {
    marginLeft: metrics.dimen_15,
    marginTop: Platform.OS === 'android' ? metrics.dimen_20 : 0,
  },
  // seprater:
  // {
  //   borderWidth: 1,
  //   marginTop: metrics.dimen_15,
  //   marginBottom: metrics.dimen_15,
  //   borderColor: colors.app_light_black
  // },
  // textInputStyle: {
  //   borderRadius: metrics.dimen_4,
  //   height: metrics.dimen_46,
  //   backgroundColor: colors.transparentBlack,
  //   color: 'white',
  //   paddingHorizontal: metrics.dimen_10,
  //   marginTop: metrics.dimen_20,
  //   fontFamily: metrics.Lato_Regular,
  //   fontSize: metrics.text_normal,
  // },
  // headerTextStyle: {
  //   fontFamily: metrics.Lato_Bold,
  //   fontSize: metrics.text_large,
  //   marginBottom: metrics.dimen_20,
  //   color: 'white'
  // },
  // buttonStyle: {
  //   borderRadius: metrics.dimen_4,
  //   width: '100%',
  //   height: metrics.dimen_46,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'white',
  //   marginBottom: metrics.dimen_37,
  //   marginTop: metrics.dimen_30,
  // },
  // signUpTextStyle: {
  //   fontFamily: metrics.Lato_Bold,
  //   fontSize: metrics.text_normal,
  //   color: colors.app_black
  // },
  // normalText: {
  //   fontFamily: metrics.Lato_SemiBold,
  //   fontSize: metrics.text_medium,
  //   color: 'white'
  // },
  // errorTextStyle: {
  //   fontFamily: metrics.Lato_Regular,
  //   fontSize: metrics.text_normal,
  //   color: colors.app_RedColor,
  //   marginTop: metrics.dimen_5,
  //   marginBottom: metrics.dimen_5
  // },
  // bottomViewStyle: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   height: metrics.dimen_72,
  //   backgroundColor: colors.app_Blue,
  //   alignItems: 'center',
  // },
  sepratertwo: {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,
  },
  radioTextStyle: {
    fontSize: metrics.dimen_12,
    color: colors.heading_blue,
    fontFamily: metrics.Roboto_regular,
  },
});
