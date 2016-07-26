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
  DatePickerAndroid,
  View
} from 'react-native';

var BookmarkScreen = require('./BookmarkScreen');
var BookmarksIndex = require('./BookmarksIndex');
var BookmarkNew    = require('./BookmarkNew');
var AjaxRequests   = require('./AjaxRequests');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class tab_reminder_rn_client extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // navigator: this.props.navigator,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }), loaded: false,
    };
  }

  renderScene(route, navigationOperations) {
    _navigator = navigationOperations;
    if (route.name === 'bookmarksIndex') {
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            onActionSelected={this._onActionSelected.bind(this, toolbarIndexActions, navigationOperations)}
            actions={toolbarIndexActions}
            style={styles.toolbar}
            titleColor="white"
            title="All Bookmarks"
            fetchAction={fetchAction} />
          <BookmarksIndex navigator={navigationOperations} bookmarks={this.state.dataSource} />
        </View>
      );
    }
    else if (route.name === 'bookmarkScreen') {
      var fetchAction = null;
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            navIcon={require('image!android_back_white')}
            onIconClicked={navigationOperations.pop}
            actions={toolbarActions}
            onActionSelected={this._onActionSelected.bind(this, toolbarActions, navigationOperations)}
            style={styles.toolbar}
            titleColor="white"
            title={route.bookmarkName}
            fetchAction={fetchAction} />
          <BookmarkScreen navigator={navigationOperations} bookmark={route.bookmark} method={this.state} />
        </View>
      );
    }
    else if (route.name === 'bookmarkNew') {
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            navIcon={require('image!android_back_white')}
            onIconClicked={navigationOperations.pop}
            actions={toolbarNewActions}
            onActionSelected={this._onActionSelected.bind(this, toolbarNewActions, navigationOperations)}
            style={styles.toolbar}
            titleColor="white"
            title="New Bookmark" />
          <BookmarkNew navigator={navigationOperations} />
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

  _onActionSelected(toolbar, navigator, position) {
    switch (toolbar[position].title) {
      case ("Create"):
        navigator.push({ name: 'bookmarkNew'});
        break;
      case ("Refresh"):
        AjaxRequests.fetchIndex.call(this);
        break;
      case ("Snooze"):
        this.setState({fetchAction: this.showPicker});
        break;
      case ("Remove Bookmark"):
        this.setState({fetchAction: AjaxRequests.deleteBookmark});
        break;
      default:
        console.log('Fall through');
    }
  }

  async showPicker() {
    var stateKey = 'snooze';
    var options = {
        date: Date.parse(this.state.bookmarkData.snooze_until),
        minDate: new Date(),
      };
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
        debugger;
        AjaxRequests.patchSnooze.call(this);
      }
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }
}


var toolbarActions = [
  {title: 'Snooze', icon: require('image!ic_schedule_black_48dp'), show: 'always'},
  {title: 'Refresh'},
  {title: 'Remove Bookmark'},
];
var toolbarIndexActions = [
  {title: 'Create', icon: require('image!ic_create_black_48dp'), show: 'always'},
  {title: 'Refresh'},
];
var toolbarNewActions = [
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
