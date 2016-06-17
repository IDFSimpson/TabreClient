'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  BackAndroid,
  Navigator,
  ListView,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';

var BookmarkScreen = require('./BookmarkScreen');
var BookmarksIndex = require('./BookmarksIndex');
//
// var REQUEST_URL = 'http://192.168.0.11:3000/api/v1/bookmarks/';
var REQUEST_URL = 'http://10.0.0.13:3000/api/v1/bookmarks/';
// var REQUEST_URL = 'http://192.168.1.37:3000/api/v1/bookmarks/';
// // var REQUEST_URL = 'http://b50-80.local:3000/api/v1/bookmarks/';

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class tab_reminder_rn_client extends Component {
  
  renderScene(route, navigationOperations) {
    _navigator = navigationOperations;
    if (route.name === 'bookmarksIndex') {
      return <BookmarksIndex navigator={navigationOperations} />
    }
    else if (route.name === 'bookmarkScreen') {
      var fetchAction = null;
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            navIcon={require('image!android_back_white')}
            onIconClicked={navigationOperations.pop}
            actions={toolbarActions}
            onActionSelected={this._onActionSelected.bind(this)}
            style={styles.toolbar}
            titleColor="white"
            title={route.bookmarkName}
            navigator={navigationOperations}
            fetchAction={fetchAction} />
          <BookmarkScreen navigator={navigationOperations} bookmark={route.bookmark} method={this.state} />
        </View>
      );
    }
  }

  render() {
    var initialRoute = {name: 'bookmarksIndex'};
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }

  _onActionSelected(position) {
    console.log('Selected ' + toolbarActions[position].title);
    switch (toolbarActions[position].title) {
      case ("Snooze"):
        this.setState({fetchAction: 'SNOOZE'});
        break;
      case ("Remove Bookmark"):
        this.setState({fetchAction: 'DELETE'});
        break;
      default:
        console.log('Fall through');
    }
  }

}


var toolbarActions = [
  {title: 'Create', icon: require('image!ic_create_black_48dp'), show: 'always'},
  {title: 'Snooze', icon: require('image!ic_schedule_black_48dp'), show: 'always'},
  {title: 'View Website'},
  {title: 'Refresh'},
  {title: 'Share Link'},
  {title: 'Make Note'},
  {title: 'Add Tag'},
  {title: 'Remove Bookmark'},
  {title: 'Settings', icon: require('image!ic_settings_black_48dp'), show: 'always'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },


  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
   listView: {
     margin: 10,
     paddingTop: 20,
     backgroundColor: '#F5FCFF',
 },
});

AppRegistry.registerComponent('tab_reminder_rn_client', () => tab_reminder_rn_client);
