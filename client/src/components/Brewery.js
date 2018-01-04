import React, { Component } from 'react';
import { setFlash } from '../actions/flash';
import { connect } from 'react-redux';
import { Segment, Header, Icon, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Brewery extends Component {
  state = { brewery: { images: {} }, loaded: false };

  componentDidMount() {
    axios.get(`/api/brewery/${this.props.match.params.name}`)
      .then(res => {
        this.setState({ brewery: res.data.entries[0], loaded: true })
      })
      .catch(error => {
        this.setState({ brewery: {}, loaded: true });
        this.props.dispatch(setFlash('Error Getting Brewery', 'error'));
    });
  }

  render() {
    const { brewery, loaded } = this.state;

    return(
      <Segment basic textAlign='center'>
        {loaded ?
          <Segment inverted>
            <Header as='h1'>{brewery.name}</Header>
            <Image centered shape='circular' src={brewery.images.square_medium} />
            { brewery.established &&
              <Segment basic style={styles.white}>
                <i>Established: {brewery.established}</i>
                <br />
              </Segment>
            }
            { brewery.website &&
              <Segment basic style={styles.white}>
                <i>Website: <a href={brewery.website} target='_blank'>{brewery.website}</a></i>
                <br />
              </Segment>
            }
            { brewery.description &&
              <Segment>{brewery.description}</Segment>
            }
            <Link to='/the_bar'><Button primary>Back To The Bar</Button></Link>
          </Segment> :
          <Segment inverted textAlign='center'>
            <Header as='h1' style={styles.white}>Loading Brewery...</Header>
            <Icon loading name='spinner' />
          </Segment>
        }
      </Segment>
    );
  }
}

const styles = {
  white: { color: 'white' },
}

export default connect()(Brewery);
