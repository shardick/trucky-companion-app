import {Platform, StyleSheet, Animated} from 'react-native';
import {COLOR} from 'react-native-material-ui';

/**
 * Style manage for the app. Contains a reference to styles object
 *
 * @class StyleManager
 */
class StyleManager
{
  constructor()
  {}

  get styles()
  {
    return _styles;
  }
}

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  sideMenu: {
    elevation: 2,
    borderColor: 'grey',
    borderRightWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 0
  },
  appDrawerStyle: {
    borderColor: 'grey',
    borderRightWidth: 1,
    overflow: 'hidden'
  },
  bottomNavigationStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  listViewContainer: {
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  offline: {
    color: 'red'
  },
  list: {
    marginBottom: 130
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 10,
    transform: [
      {
        scale: 1.5
      }
    ]
  },
  simpleRow: {
    flexDirection: 'row'
  },
  marginTop20: {
    marginTop: 20
  },
  simpleFlex: {
    flex: 1
  },
  hidden: {
    height: 0,
    width: 0
  },
  gameVersionMainImage: {
    width: 220,
    height: 160,
    marginTop: 10
  },
  gameVersionRow: {
    marginTop: 10
  },
  gameVersionNews: {
    marginTop: 10,
    fontSize: 20,
    color: 'red',
    textAlign: 'center'
  },
  gameVersionContainer: {
    alignItems: 'center'
  },
  gameVersionTotalPlayer: {
    marginTop: 10,
    fontSize: 20
  },
  gameStatusContainer: {
    padding: 10
  },
  appSettingsHeader: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10
  },
  appSettingsHeaderText: {
    color: '#009688',
    fontWeight: '500'
  },
  appSettingsRow: {
    flexDirection: 'row',

    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingBottom: 15,
    borderColor: '#d6d5d9',
    borderStyle: 'solid',
    borderBottomWidth: 1
  },
  appSettingsRowColumns: {
    flexDirection: 'column',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    borderColor: '#d6d5d9',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    paddingBottom: 15
  },
  appSettingsLabel: {
    marginTop: 4,
    flex: 1,
    color: 'black'
  },
  appSettingsFieldBelow: {},
  appSettingsField: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  appSettingsPicker: {
    fontSize: 14
  },
  rulesMarkDownContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 95
  },
  serversListMainContainer: {
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  serversListGameTimeContainer: {
    marginTop: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  serversListGameTimeIcon: {
    marginTop: 4
  },
  serversListGameTimeText: {
    marginLeft: 5
  },
  serversListRowContainer: {
    marginBottom: 5,
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: 0.5
  },
  serversListRowHeaderOnline: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center'
  },
  serversListRowHeaderOffline: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center'
  },
  serversListRowHeaderText: {
    color: 'white',
    fontSize: 20
  },
  serversListRowHeaderLittleText: {
    fontSize: 16
  },
  serversListOnlinePlayers: {
    fontSize: 20
  },
  serversListServerSize: {
    fontSize: 12
  },
  serversListDescriptionRow: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginLeft: 10
  },
  serversListDescriptionIcon: {
    marginRight: 5,
    marginTop: 4
  },
  serversListProgressBarContainer: {
    paddingTop: 5
  },
  serversListStatusContainer: {
    alignItems: 'center',
    paddingBottom: 5
  },
  meetupsListList: {
    marginBottom: 70
  },
  meetupsRowContainer: {
    padding: 5
  },
  meetupsRowButtonContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flex: 1
  },
  meetupsRowTitle: {
    fontSize: 18
  },
  meetupRowTitleTime: {
    marginTop: 7,
    fontSize: 12
  },
  meetupSearchFormContainer: {
    padding: 10
  },
  meetupsSearchFormLabel: {
    padding: 5,
    marginBottom: 5
  },
  meetupsSearchFormField: {
    padding: 5,
    marginBottom: 10
  },
  aboutCenter: {
    marginTop: 20,
    alignItems: 'center'
  },
  aboutImage: {
    width: 200,
    height: 200
  },
  aboutText: {
    marginTop: 10
  },
  splashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#A51745"
  },
  splashScreenImage: {
    width: 250,
    height: 250
  },
  newsListMainContainer: {
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  newsListList: {
    /*marginBottom: 70*/
  },
  newsRowContainer: {
    padding: 10
  },
  newsRowTitle: {
    fontSize: 18
  },
  newsDate: {
    fontSize: 14
  },
  newsText: {
    fontSize: 14
  },
  newsRowButtonContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flex: 1
  },
  searchPlayerContainer: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20
  },
  searchTypeLabel: {
    marginTop: 10,
    marginBottom: 10
  },
  playerSearchResultContainer: {
    marginTop: 10
  },
  containerHidden: {
    position: 'absolute',
    top: -200
  },
  playerSearchResultTitleContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  playerSearchResultTitle: {
    color: '#009688',
    fontWeight: '500'
  },
  playerSearchResultButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  playerSearchResultImage: {
    width: 100,
    height: 100
  },
  playerSearchResultCountryFlag: {
    width: 60,
    height: 40,
    marginBottom: 10
  },
  playerSearchBanRow: {
    paddingBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid'
  },
  playerOnlineStatusContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  playerOnline: {
    color: 'green'
  },
  playerOffline: {
    color: 'red'
  },
  mapCredits: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  mapPoiListItem: {
    marginBottom: 5,
    marginTop: 5
  },

  friendsListSectionTitle: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#009688',
    fontWeight: '500'
  },
  friendsListMainContainer: {
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  friendsListRow: {
    padding: 10,
    flexDirection: 'row'
  },
  friendsListProfileImage: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  friendListUsername: {
    fontWeight: '500'
  },
  friendsListUsernameContainer: {
    flexDirection: 'column'
  },
  friendsListLoginToSteamContainer: {
    marginTop: 30,
    padding: 10
  },
  friendsListCheckingStateContainer:
  {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5
  }
});

_styles.uiTheme = {
  palette: {
    primaryColor: "#A51745",
    accentColor: COLOR.pink500
  }
};

_styles.rulesMarkDownSyles = {
  heading1: {
    fontSize: 20
  },
  link: {
    color: '#03a9f4'
  },
  paragraph: {
    fontSize: 12
  }
};

/* ios style overrides */
if (Platform.OS == 'ios') {
  _styles.searchPlayerContainer.paddingTop = 200;

  _styles.searchPlayerTextInput = 
  { 
    marginTop: 10,
    borderWidth: 1,
    height: 30
  }
}
module.exports = StyleManager;