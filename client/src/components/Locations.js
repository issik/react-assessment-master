import React, { Component } from 'react';
import axios from 'axios';
import { Segment, Header, Grid, Card, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setFlash } from '../actions/flash';
import InfiniteScroll from 'react-infinite-scroller';
import GoogleMapReact from 'google-map-react';

class Locations extends Component {
  state = { locations: [], loaded: false, page: 1, totalPages: 0, perPage: 5 };

  componentDidMount() {
    axios.get(`/api/all_locations?per_page=${this.state.perPage}`)
      .then(res => {
        this.setState({ locations: res.data.entries, page: res.data.page, totalPages: res.data.total_pages, loaded: true });
      })
      .catch( error => {
        this.props.dispatch(setFlash('Error Getting Locations.', 'error'));
    });
  }

  loadFunc = () => {
    const nextPage = this.state.page + 1;
    const { locations, perPage } = this.state;

    axios.get(`/api/all_locations?page=${nextPage}&per_page=${perPage}`)
      .then( res => {
        this.setState({ locations: [...locations, ...res.data.entries], page: nextPage });
      })
      .catch(error => {
        this.props.dispatch(setFlash('Error Getting More Locations. You Must Be Drunk!', 'error'));
    });
  }

  displayLocations = () => {
    return this.state.locations.map( location => {
      console.log(location);
      const position = { lat: location.latitude, lng: location.longitude };
      const mapOptions = {panControl: true, mapTypeControl: true, scrollWheel: true, mapTypeId: 'satellite' };

      return(
          <Card fluid key={location.id}>
            <Card.Content header={location.name} />
            <Card.Content description={`Country: ${location.country.display_name}`} />
            <Card.Content description={`Phone: ${location.phone}`} />
            <Card.Content description={`Street Address: ${location.street_address}`} />
            <Card.Content extra>
              <Segment basic style={{ height: '300px', width: '300px', margin: '0 auto' }}>
                <GoogleMapReact
                  options={mapOptions}
                  defaultCenter={position}
                  defaultZoom={16}
                  center={position}
                />
              </Segment>
            </Card.Content>
          </Card>
      );
    });
  }

  display = () => {
    const { page, loaded, totalPages } = this.state;

    if(loaded)
      return(
        <Segment basic textAlign='center'>
          <Header as='h1'  style={styles.white}>All Locations</Header>
            <Segment basic style={styles.scroller}>
              <InfiniteScroll
                  pageStart={page}
                  loadMore={this.loadFunc}
                  hasMore={page < totalPages}
                  loader={<Header as='h1' textAlign='center' style={styles.white}>Loading More Locations...</Header>}
                  useWindow={false}
              >
                { this.displayLocations() }
              </InfiniteScroll>
            </Segment>
        </Segment>
      );
    else
      return(
        <Segment inverted textAlign='center'>
          <Header as='h1'>Loading Locations...</Header>
          <Icon loading name='spinner' />
        </Segment>
      )
  }

  render() {
    return(
      <Segment inverted textAlign='center' style={styles.white}>
        { this.display() }
      </Segment>
    );
  }
}

const styles = {
  white: { color: 'white' },
  scroller: { height: '80vh', overflow: 'auto', width: '100%' },
}

export default connect()(Locations);
