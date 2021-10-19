const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST
import { getUserId } from '../../../SupportingFIles/Utills';

const AllInfluencer = Base_URL + "api/featuredinfluencerslist"
const Searchinfluencerslist = Base_URL + "api/searchinfluencerslist"
const koliinfluencers = Base_URL + "api/koliinfluencers"
const searchkoliinfluencerslist = Base_URL + "api/searchkoliinfluencerslist"


export const getAllInfluencer = async(OffsetValue,followercount, latitude, longitude) =>{
    //let url = AllInfluencer + '?offset=' +OffsetValue+ "&followers=" +followercount

    var url = koliinfluencers + '?offset=' +OffsetValue+ "&followers=" +followercount
    if(followercount === 3)
    {
        url = url+"&latitude=" +latitude+"&longitude=" +longitude
    }
    else if(followercount === 4)
    {
        url = koliinfluencers + '?offset=' +OffsetValue+"&lastSeen=1"
    }
    await getUserId().then(userid => {
        if(userid !== null)
        {
            url = url+"&ownerId=" +userid+"@user_id="+userid
           
        }
      })
      console.log("url=======",url)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const SearchInfluencer = async(param) =>{
    await getUserId().then(userid => {
        if(userid !== null)
        {
            param.ownerId = userid
        }

      })
    return axios.post(searchkoliinfluencerslist,param)
    .then(response => response)
    .catch(error => error)
}