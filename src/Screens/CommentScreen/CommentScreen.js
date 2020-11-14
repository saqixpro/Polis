import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './styles';
import theme from '../../theme';
import {postImg, user} from '../../aseets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTab from '../../components/bottomTab';
import Functions from '../../functions/functions';
import { connect } from 'react-redux';
import * as ActionTypes from '../../redux/reducers/actionTypes';

const {width} = Dimensions.get('screen')

class CommentScreen extends Component {
  state = {
    cmnt: '',
    alignment: new Animated.Value(0),
    post: {},
    comments: [],
  };

  componentDidMount = () => {
    this.fetchPost()
  }

  formatTime = (timeStamp) => {
    const timeInSeconds = (new Date().getTime() - new Date(timeStamp).getTime()) / 1000;
    if(timeInSeconds < 60) return `${timeInSeconds.toFixed(0)} s`;
    const timeInMinutes = timeInSeconds / 60;
    if(timeInMinutes < 60) return `${timeInMinutes.toFixed(0)} m`;
    const timeInHours = timeInMinutes / 60;
    if(timeInHours < 24) return `${timeInHours.toFixed(0)} h`;
    const timeInDays = timeInHours / 24;
    if(timeInDays < 30) return `${timeInDays.toFixed(0)} d`;
    const timeInMonths = timeInDays / 30;
    if(timeInMonths < 12) return `${timeInMonths.toFixed(0)} months`;
    return `${(timeInMonths / 12).toFixed(0)} y`;
  } 

  fetchPost = async () => {
  try{
    const {postID} = this.props.navigation.state.params;
    const post = this.props.posts.find(post => post.id == postID);


    // FETCH Author Data For Each Comment
    let comments = post.comments;

    if(comments.length > 0) {
      for(let i = 0; i < comments.length; i++){
        const _author = typeof comments[i].author == 'string' ? comments[i].author : comments[i].author.uid;
        const {user} = await Functions.fetchUserById(_author);
        comments[i] = {...comments[i], author: user};
      }
      this.setState({comments: comments.sort((a, b) => {
        return a.timeStamp < b.timeStamp ? 1 : b.timeStamp < a.timeStamp ? -1 : 0;
      })})
    } else this.setState({comments: []})

    this.setState({post});

  } catch (error) {
    console.log(error);
  }
  }

  makeComment = async () => {
    const data = {
      id: this.state.comments.length + 1,
      textContent: this.state.cmnt,
      author: this.props.user.uid,
      likes: [],
      replies: [],
      timeStamp: Date.now()
    }

  const comments = this.state.comments;
  comments.unshift({...data, author: this.props.user});
  this.setState({comments})

  const updatedPost = {...this.state.post , comments: comments};


   await this.props.updatePost(updatedPost, this.state.post.id);
   await Functions.makeComment(data, this.state.post.id);
   
  }

  renderComments = ({item, index}) => {
    return (
      <View style={styles.cardStyle}>
        <View style={[styles.horizontal, {justifyContent: 'space-between', maxWidth: '90%', alignSelf: 'center'}]}>
          <View style={{}}>
          {item.author.avatar ? (
                <Image source={{uri : item.author.avatar}} style={styles.userImgStyle} />
              ) : (
                <View style={{ height: 40,
                  backgroundColor: "#fff",
                  width: 40,
                  borderRadius: 15,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  shadowColor: "#aaa",
                  shadowOffset: {
                    width: 3, 
                    height: 3
                  },
                  shadowOpacity: 0.9,
                  marginHorizontal: 12,
                  shadowRadius: 3.5,
                 }}>
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>{this.state.post.author ? this.state.post.author.name.charAt(0).toUpperCase() : null }</Text>
                </View>
              )}
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignSelf: 'center',
              width: '80%',
            }}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 12}}>{item.author.name}</Text>
          <Text style={{color: '#8F92A1', fontSize: 12}}>@{item.author.username}</Text>
            </View>
            <Text
              style={[
                {
                  fontSize: 12,
                  marginTop: -5,
                  alignSelf: 'center',
                  color: '#8F92A1',

                  // color: theme.colors.gray,
                },
              ]}>{this.formatTime(item.timeStamp)} ago </Text>
          </View>
        </View>
        {/* <Text style={[styles.largeText, {color: theme.colors.gray}]}>
        {`${item.mention} @AlexJobra`}
      </Text> */}
        <View style={{alignSelf: 'center', width: '70%', alignItems: 'flex-start', paddingVertical: 5}}>
          <Text style={[styles.mediumText, {marginVertical: 10}]}>
            {item.textContent}
          </Text>
        </View>
        {this.state.post.poll ? (
          <View style={{width : '100%', alignItems: 'center', justifyContent :'center'}}>
            <Text>Poll Post</Text>
            </View>
        ) : null}
        <View style={[styles.horizontal, {justifyContent: 'space-between', alignSelf: 'flex-start', marginLeft: '6%', width: "40%"}]}>
        <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={() => this.props.navigation.navigate('CommentScreen')}>
            <View style={[styles.bottomContainer]}>
              <Ionicons name="ios-chatbox-outline" size={20} color="gray" />
    <Text style={{marginLeft: 5}}>{item.replies ? item.replies.length : 0}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.bottomContainer]}>
            <TouchableOpacity style={{marginHorizontal: 10}}>
              <Ionicons name="ios-heart-outline" size={22} color="gray" />
            </TouchableOpacity>
            <Text>{item.likes ? item.likes.length : 0}</Text>
          </View>
         
        </View>
      </View>
    );
  };

  Post = () => {
    return this.state.post && this.state.post.author ?  (
      <View style={styles.cardStyle}>
        <View style={[styles.horizontal, {width: width / 1.2}]}>
          <View style={{}}>
              {this.state.post.author.avatar ? (
                <Image source={{uri : this.state.post.author.avatar}} style={styles.userImgStyle} />
              ) : (
                <View style={{ height: 50,
                  backgroundColor: "#fff",
                  width: 50,
                  borderRadius: 20,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  shadowColor: "#aaa",
                  shadowOffset: {
                    width: 3, 
                    height: 3
                  },
                  shadowOpacity: 0.9,
                  marginHorizontal: 12,
                  shadowRadius: 3.5,
                 }}>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{this.state.post.author ? this.state.post.author.name.charAt(0).toUpperCase() : null }</Text>
                </View>
              )}
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignSelf: 'center',
              width: '80%',
            }}>
            <View style={{width: '60%'}}>
          <Text style={{fontWeight: 'bold'}}>{this.state.post.author ? this.state.post.author.name : null}</Text>
          <Text style={{color: '#8F92A1'}}>@{this.state.post.author ? this.state.post.author.username : null}</Text>
            </View>
            <Text
              style={[
                {
                  // fontFamily: Fonts.RobotoRegular,
                  fontSize: 12,
                  alignSelf: 'center',
                  color: '#8F92A1',

                  // color: theme.colors.gray,
                },
              ]}>{this.formatTime(this.state.post.timeStamp)} ago </Text>
          </View>
        </View>
        <View>
          {this.state.post.image ? (
            <Image
            style={styles.questionImage}
            resizeMode="cover"
            source={{uri: this.state.post.image}}
          />
          ) : null}

          <Text style={[styles.mediumText, {marginVertical: 15, maxWidth: '75%'}]}>
            {this.state.post.textContent}
          </Text>
        </View>
      </View>
    ) : null
  };
  onImageChange = (event) => {
    const {uri, linkUri, mime, data} = event.nativeEvent;
  };

  animateBottomTabs = (val) =>
    Animated.timing(this.state.alignment, {
      toValue: val,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

  render() {
    const bottomTabInteropolate = this.state.alignment.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
    });
    const bottomTabDynamicStyle = {
      transform: [
        {
          translateY: bottomTabInteropolate,
        },
      ],
    };
    return (
      <View style={styles.mainContainer}>
        <SafeAreaView />
        <this.Post />
        <View style={{alignSelf: 'center', width: '80%'}}>
          <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 20}}>Comments ({this.state.post.comments ? this.state.post.comments.length : 0})</Text>
        </View>
        <FlatList
          data={this.state.comments}
          renderItem={({item}) => <this.renderComments item={item} />}
        />
        <KeyboardAvoidingView behavior="padding">
        {this.state.post.author ? (
              <Text style={styles.replying}>Replying to  @{this.state.post.author.username}</Text>
        ) : null}
          <View style={[styles.horizontalContainer, {marginTop: 10, marginBottom: 20}]}>
          <TextInput
            style={styles.input}
            placeholder="Reply to the post"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholderTextColor="gray"
            value={this.state.cmnt}
            underlineColorAndroid="transparent"
            onChangeText={(cmnt) => {
              this.setState({cmnt});
            }}
          />
          <TouchableOpacity onPress={this.makeComment} style={{alignSelf: 'center', marginLeft: 15}}>
            <MaterialCommunityIcons
              name="send"
              size={32}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            height: 70,
            zIndex: 10000,
          }}>
          <Animated.View style={[bottomTabDynamicStyle]}>
            <BottomTab navigation={this.props.navigation} />
          </Animated.View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({user: state.rootReducer.user, posts: state.rootReducer.posts});
const mapDispatchToProps = dispatch => ({
  updatePost: (data, id) => dispatch({type: ActionTypes.MAKE_COMMENT, payload: {
    data, id
  }})
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(CommentScreen);