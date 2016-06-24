'use strict';

import React, { Component } from 'react';
import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  WebView,
  View,
} from 'react-native';

const REQUEST_URL = 'https://tabre.herokuapp.com/api/v1/bookmarks/';

class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark: null,
    };
  }

  componentWillReceiveProps(){
    console.log('componentWillReceiveProps');

    if (this.props.method && this.props.method.fetchAction && this.props.method.fetchAction === 'POST') {
      this.postData();
    } else if (this.props.method && this.props.method.fetchAction && this.props.method.fetchAction === 'PATCH') {
      this.patch();
    } else if (this.props.method && this.props.method.fetchAction && this.props.method.fetchAction === 'SNOOZE') {
      this.showPicker.call(this, 'snooze', {
                date: this.state.snoozeDate,
                minDate: new Date(),
              });
    } else if  (this.props.method && this.props.method.fetchAction && this.props.method.fetchAction === 'DELETE') {
      this.deleteBookmark();
    } else {
      this.fetchData();
    }
  }

  componentDidMount() { this.fetchData(); }

  fetchData() {
    fetch(REQUEST_URL + this.props.bookmark)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        bookmarkData: responseData,
      });
    })
    .done();
  }

  postData() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         firstParam: 'yourValue',
         secondParam: 'yourOtherValue',
      })
    })
  }

  patchData() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         firstParam: 'yourValue',
         secondParam: 'yourOtherValue',
      })
    })
  }

  patchSnooze() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookmark: {
          snooze_until: this.state.snoozeDate,
        }
      })
    })
  }

  deleteBookmark() {
    console.log("deleting bookmark");
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(this.props.navigator.pop())
  }

  async showPicker(stateKey, options) {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
      // todo Don't do this here
      this.patchSnooze.call(this);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }

  render() {
    if (!this.state.bookmarkData) {
      return this.renderLoadingView();
    }

    return this.renderBookmark(this.state.bookmarkData);
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ... </Text>
      </View>
    );
  }

  renderBookmark(bookmark) {
    return (
      <View>
        <Text>{bookmark.url}</Text>
        <WebView
          style={styles.webView}
          source={{html: bookmark.scraped_content}}
          scalesPageToFit={this.state.scalesPageToFit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
   webView: {
     height: 350,
 },
});

module.exports = BookmarkScreen;
