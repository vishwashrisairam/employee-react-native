import React,{useState} from 'react';
import { StyleSheet,Text,View,Alert,Modal,KeyboardAvoidingView } from 'react-native';
import {TextInput,Button} from 'react-native-paper';
// import Modal from 'modal-react-native-web';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({navigation,route}) =>{

    const getDetails= (type) => { 
        if(route.params){
            return route.params[type]
        }else{
            return "";
        }
    }

    const [name,setName] =useState(getDetails("name"));
    const [phone,setPhone] =useState(getDetails("phone"));
    const [email,setEmail] =useState(getDetails("email"));
    const [salary,setSalary] =useState(getDetails("salary"));
    const [position,setPosition] = useState(getDetails("position"));
    const [picture,setPicture] =useState(getDetails("picture"));
    const [modalVisible,setModalVisible] =useState(false);
    const [enableshift,setenableShift] = useState(false)

    const pickFromGallery = async () =>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                aspect:[1,1],
                quality:0.5
            });
            console.log(data)
            if(!data.cancelled){
                let newFile = {
                    uri:data.uri, 
                    type:`test/${data.uri.split('.')[1]}`,
                    name:`test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        }else{
            Alert.alert("Please grant permissions to proceed!!!");
        }
    }

    const pickFromCamera = async () =>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                aspect:[1,1],
                quality:0.5
            });
            console.log(data)
            if(!data.cancelled){
                let newFile = {
                    uri:data.uri, 
                    type:`test/${data.uri.split('.')[1]}`,
                    name:`test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        }else{
            Alert.alert("Please grant permissions to proceed!!!");
        }
    }

    const handleUpload=(image)=>{
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","employee");
        data.append("cloud_name","vsairam");

        fetch("https://api.cloudinary.com/v1_1/vsairam/image/upload",{
            method:"POST",
            body:data
        }).then(res=>res.json()
        ).then(data=> {
            console.log(data);
            setPicture(data.url)
            setModalVisible(false);
        });
    }

    const submitData = ()=>{
        fetch("http://192.168.0.12:3000/send-data",{
            method:"post",
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert(`${data.name} is saved successfuly`)
            navigation.navigate("Home")
        })
        .catch(err=>{
          Alert.alert("someting went wrong")
      })
  }

  const updateDetails = () => {
    fetch("http://192.168.0.12:3000/update",{
            method:"post",
            headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id: route.params._id,
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert(`${data.name} is updated successfuly`)
            navigation.navigate("Home")
        })
        .catch(err=>{
        Alert.alert("someting went wrong")
    })
  }

    return (
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
        <View>
            <TextInput
                label="Name"
                value={name}
                style={styles.inputStyle}
                theme={theme}
                mode="outlined"
                onChangeText={text=>setName(text)}
                onFocus={()=>setenableShift(false)}
            />
            <TextInput
                label="Email"
                value={email}
                style={styles.inputStyle}
                theme={theme}
                mode="outlined"
                onChangeText={text=>setEmail(text)}
                onFocus={()=>setenableShift(false)}
            />

            <TextInput
                label="Phone"
                value={phone}
                style={styles.inputStyle}
                keyboardType="number-pad"
                theme={theme}
                mode="outlined"
                onChangeText={text=>setPhone(text)}
                onFocus={()=>setenableShift(true)}
            />
            <TextInput
                label="Salary"
                value={salary}
                style={styles.inputStyle}
                theme={theme}
                mode="outlined"
                onChangeText={text=>setSalary(text)}
                onFocus={()=>setenableShift(true)}
            />
            <TextInput
                label="Position"
                value={position}
                style={styles.inputStyle}
                theme={theme}
                mode="outlined"
                onChangeText={text=>setPosition(text)}
                onFocus={()=>setenableShift(true)}
            />
            <Button 
                icon={picture ===""? "upload":"check"}
                mode="contained"
                theme={theme}
                onPress={()=>setModalVisible(true)}
            > Upload Image 
            </Button>
            { route.params ?
                <Button 
                    icon="content-save"
                    mode="contained"
                    theme={theme}
                    onPress={()=>updateDetails()}
                > Update 
                </Button>
                : <Button 
                        icon="content-save"
                        mode="contained"
                        theme={theme}
                        onPress={()=>submitData()}
                        > Save 
                        </Button>

            }
            <Modal 
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={{borderWidth:0,borderColor:'none'}}
                presentationStyle="overFullScreen"
                onRequestClose={()=>setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                        <Button 
                            icon="camera"
                            mode="contained"
                            theme={theme}
                            onPress={()=>pickFromCamera()}
                        > Camera</Button>
                        <Button 
                            icon="image-area"
                            mode="contained"
                            theme={theme}
                            onPress={()=>pickFromGallery()}
                        > Gallery</Button>
                    </View>
                    <Button 
                        theme={theme}
                        onPress={()=>setModalVisible(false)}
                    > Cancel</Button>
                </View>
            </Modal>
        </View>
        </KeyboardAvoidingView>
       
    );
}

const theme= {
    colors:{
        primary:"#006aff"
    }
}

const styles = StyleSheet.create({
    root:{
        flex:1
    },
    inputStyle:{
        margin:5

    },
    modalView:{
        position:"absolute",
        bottom:20,
        justifyContent:"center",
        alignItems: "center",
        width:"100%",
        backgroundColor:"white"
    },
    modalButtonView:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10
    }
});

export default CreateEmployee;