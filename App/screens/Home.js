import React,{useEffect,useState} from 'react';
import { StyleSheet,Text,View,Image,FlatList,Alert } from 'react-native';
import {Card,FAB} from 'react-native-paper';
import {useSelector,useDispatch} from 'react-redux';

// import profileImage from '../assets/images/img2.jpg'

const styles = StyleSheet.create({
  myCard: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardView: {
    flexDirection: "row",
    padding: 6,
  },
  text: {
    fontSize: 20,
    marginLeft: 15,
  },
  fab:{
      position:"absolute",
      margin:16,
      right:0,
      bottom:0
  }
});

const Home = ({navigation} )=>{

    // const [data,setData] = useState([]);
    // const [loading,setLoading] = useState(true);
    const dispatch = useDispatch()
    const {data,loading}=useSelector((state)=> state)

    useEffect(()=>{
      fetchData();
    },[])

    const fetchData = () => {
      fetch("http://192.168.0.12:3000/")
        .then(res=>res.json())
        .then(results=>{
            // setData(data);
            // setLoading(false)
            dispatch({type:"ADD_DATA",payload:results})
            dispatch({type:"SET_LOADING",payload:false})
        })
        .catch(err=>{
          Alert.alert("someting went wrong:"+err)
      })
    }


    const renderList = (x=> {
        return (
        <Card 
          style={styles.myCard} 
          key={x._id}
          onPress={()=>navigation.navigate("Profile",{x})}
        >
          <View style={styles.cardView}>
            <Image style={styles.profileImage} source={{uri:x.picture}} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.text}>{x.name}</Text>
              <Text style={styles.text}>{x.position}</Text>
            </View>
          </View>
        </Card>
    )});

    return (
      <View style={{flex:1}}>
        {/* {renderList} */}
        <FlatList
            data={data}
            renderItem={({item})=>renderList(item)}
            keyExtractor={item=>item._id}
            refreshing={loading}
            onRefresh={()=>fetchData()}

        />
      
       
        <FAB
            style={styles.fab}
            large
            icon="plus"
            theme={{colors:{accent:"#006aff"}}}
            onPress={()=>navigation.navigate("Create")}
        />
      </View>
    );
}

export default Home;
