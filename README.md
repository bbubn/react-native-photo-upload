# react-native-photo-upload

![screenshot](http://g.recordit.co/egzm6lL96l.gif)

This component handles all the hassle in dealing with photos in react native, it's built on top of `react-native-image-picker`, `react-native-image-resizer` and `react-native-fs`
it takes an image component and upon click, you get the image picker prompt, get the base64 string of the image and the image source changes to whatever image was picked.

## Installing

npm or yarn install

```
npm install react-native-photo-upload --save
```
or
```
yarn add react-native-photo-upload
```
## Automatic Installation

link `react-native-image-picker`, `react-native-image-resizer` and `react-native-fs` which the component depends on
```
react-native link react-native-image-picker
react-native link react-native-image-resizer
react-native link react-native-fs
```
#### The following steps are required by `react-native-image-picker` for both Android and IOS even with automatic linking

### Android

* Update the android build tools version to `2.2.+` in `android/build.gradle` (required step by `react-native-image-picker):
```gradle
buildscript {
    ...
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.+' // <- USE 2.2.+ version
    }
    ...
}
...
```

* Update the gradle version to `2.14.1` in `android/gradle/wrapper/gradle-wrapper.properties`:
```
 ...
 distributionUrl=https\://services.gradle.org/distributions/gradle-2.14.1-all.zip
```

* Add the required permissions in `AndroidManifest.xml`:
```xml
 <uses-permission android:name="android.permission.CAMERA" />
 <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### IOS
For iOS 10+, Add the `NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`, and `NSMicrophoneUsageDescription` (if allowing video) keys to your `Info.plist` with strings describing why your app needs these permissions. **Note: You will get a SIGABRT crash if you don't complete this step**
```
<plist version="1.0">
  <dict>
    ...
    <key>NSPhotoLibraryUsageDescription</key>
    <string>photo</string>
    <key>NSCameraUsageDescription</key>
    <string>camera</string>
  </dict>
</plist>
```

## Manual Installation

check the docs of each library on how to link manually.

* [react-native-image-picker](https://github.com/react-community/react-native-image-picker)
* [react-native-image-resizer](https://github.com/bamlab/react-native-image-resizer)
* [react-native-fs](https://github.com/itinance/react-native-fs)

 ## Usage

 Wrap your default image inside the PhotoUpload component, the component wraps the image with TouchableOpacity, on press it will trigger the image picker prompt. after selecting a new image from the picker, the image source will get replaced with the new image base64 string as uri

 ```
  <PhotoUpload>
    <Image
      source={{
        uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
      }}
    />
  </PhotoUpload>
 ```

 ## Example

 ```
  import { Image } from 'react-native'
  import PhotoUpload from 'react-native-photo-upload'

  <PhotoUpload
    onPhotoSelect={avatar => {
      if (avatar) {
        console.log('Image base64 string: ', avatar)
      }
    }}
  >
    <Image
      style={{
        paddingVertical: 30,
        width: 150,
        height: 150,
        borderRadius: 75
      }}
      resizeMode='cover'
      source={{
        uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
      }}
    />
  </PhotoUpload>
 ```


 ## Props

 Prop | Type | Description
 -----|------|------------
 containerStyle | Object | Style object for the image container
 pickerTitle | String | Title for the image picker prompt, default is 'Select Photo'
 pickerProps | Object | The original ImagePicker props / options * [react-native-image-picker#options](https://github.com/react-community/react-native-image-picker#options)
 height | Number | the resized image height, default is 300
 width | Number | the resized image width, default is 300
 format | String | The format desired of the resized image, 'JPEG' or 'PNG' default is 'JPEG'
 quality | Number | The quality of the resized image indicated by a number between 1 and 100, default is 80
 onPhotoSelect | Function | function which return combined object (details below)

 ## The Response Object

 Prop | Description
 -----|------------
 didCancel | Informs you if the user cancelled the process
 error | Contains an error message, if there is one
 customButton | If the user tapped one of your custom buttons, contains the name of it
 name | The file name
 size | The file size
 path | The file path
 uri | The uri to the local file asset on the device
 base64 | The base64 encoded image data
 maxWidth | Max width from config
 maxHeight | Max height from config
 original | Original ImagePicker response witch exclude `data` key
 original.fileName | Original file name
 original.fileSize | Original file size
 original.timestamp | Timestamp metadata, if available, in ISO8601 UTC forma
 original.width | Original file width
 original.height | Original file height
 original.isVertical | Will be true if the image is vertically oriented
 original.longitude | Longitude metadata, if available
 original.latitude | Latitude metadata, if available
 original.uri | The uri to the local file asset on the device
 original.origURL | The URL of the original asset in photo library, if it exists
