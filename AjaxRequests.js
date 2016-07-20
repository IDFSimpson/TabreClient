'use strict';

const REQUEST_URL = 'https://tabre.herokuapp.com/api/v1/bookmarks/';

var AjaxRequests = {

  fetchIndex() {
    fetch(REQUEST_URL)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true,
      });
    })
    .done();
  },

  fetchData() {
    fetch(REQUEST_URL + this.props.bookmark)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        bookmarkData: responseData,
      });
    })
    .done();
  },

  postData() {
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookmark: {
          name: this.state.name,
          url: this.state.url,
        }
      })
    })
  },

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
  },

  deleteBookmark() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(this.props.navigator.pop())
    .then(AjaxRequests.fetchIndex.call(this))
  }
}

module.exports = AjaxRequests;
