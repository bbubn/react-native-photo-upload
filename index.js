import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs'

export default class PhotoUpload extends React.Component {
  static propTypes = {
    containerStyle: PropTypes.object,
    photoPickerTitle: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    format: PropTypes.string,
    quality: PropTypes.number,
    pickerProps: PropTypes.object,
    onPhotoSelect: PropTypes.func // returns the base64 string of uploaded photo
  }

  state = {
    height: this.props.height || 300,
    width: this.props.width || 300,
    format: this.props.format || 'JPEG',
    quality: this.props.quality || 80
  }

  options = {
    title: this.props.pickerTitle || 'Select Photo',
    storageOptions: {
      skipBackup: true,
      path: 'images'
    },
    ...this.props.pickerProps // you can any original ImagePicker props
  }

  openImagePicker = () => {
    // get image from image picker
    ImagePicker.showImagePicker(this.options, async response => {

      if ( response.didCancel || response.error || response.customButton ) {
        this.response( response );
        return;
      }

      let { height, width, quality, format } = this.state

      // resize image
      const resizedImageUri = await ImageResizer.createResizedImage(
        `data:image/jpeg;base64,${response.data}`,
        height,
        width,
        format,
        quality
      )
      const filePath = Platform.OS === 'android' && resizedImageUri.uri.replace
        ? resizedImageUri.uri.replace('file:/data', '/data')
        : resizedImageUri.uri

      // convert image back to base64 string
      const photoData = await RNFS.readFile(filePath, 'base64')
      let source = { uri: resizedImageUri.uri }

      this.setState({
        avatarSource: source
      })

      this.response({
        ...resizedImageUri,
        maxWidth: width,
        maxHeight: height,
        base64: photoData,
        original: {
          fileSize: response.fileSize,
          timestamp: response.timestamp,
          uri: response.uri,
          origURL: response.origURL,
          fileName: response.fileName,
          width: response.width,
          height: response.height,
          isVertical: response.isVertical,
          longitude: response.longitude,
          latitude: response.latitude
        }
      })
    })
  }

  response = ( data = {} ) => {
    if ( this.props.onPhotoSelect && typeof this.props.onPhotoSelect == 'function' )
      this.props.onPhotoSelect(data)
  }

  renderChildren = props => {
    return React.Children.map(props.children, child => {
      if (child.type === Image && this.state.avatarSource) {
        return React.cloneElement(child, {
          source: this.state.avatarSource
        })
      } else return child
    })
  }

  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity onPress={this.openImagePicker}>
          {this.renderChildren(this.props)}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
