import {StyleSheet, Animated} from 'react-native';
import {COLOR} from 'react-native-material-ui';

const styles = StyleSheet.create({
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
  gameVersionContainer: {
    alignItems: 'center'
  },
  gameVersionTotalPlayer: {
    marginTop: 10,
    fontSize: 20
  },
  appSettingsHeader:
  {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  appSettingsHeaderText:
  {
    color:'#009688',
    fontWeight:'500'
  },
  appSettingsRow: {
    flexDirection: 'row',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingBottom: 15,
    borderColor: '#d6d5d9',
    borderStyle: 'solid',
    borderBottomWidth: 1,
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
    color:'black',
  },
  appSettingsFieldBelow: {},
  appSettingsField: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  appSettingsPicker:
  {
    fontSize: 14
  },
  rulesMarkDownContainer: {
    padding: 20
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
  }
});

styles.uiTheme = {
  palette: {
    primaryColor: "#A51745",
    accentColor: COLOR.pink500
  }
};

styles.rulesMarkDownSyles = {
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

module.exports = styles;