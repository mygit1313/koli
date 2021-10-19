import { action, observable, decorate } from 'mobx';

import { getAllInfluencer } from '../../API/Profile/User/ApiInfluencer';
import { gettUserData} from '../../SupportingFIles/Utills';


class InfluencerStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    isLoading = false
    InfluencerList = []
    userExist = false
    hasNextPage = 0
    end_curser = false
    offSetlength = 50
    Sortby='2'
    fetchingNextPageData = false
    userLatitute = ''
    userLongitude = ''
    refreshing = false
    showInfluencerSortPopup = false

    setUserLocation = (userLatitute,longitude) => {
        this.userLatitute = userLatitute
        this.userLongitude = longitude

    }
    setShowInfluencerPopup = (showPopup) =>{
        this.showInfluencerSortPopup = showPopup
    }
    setSortby = (Sortby) => {
        this.Sortby = Sortby
    }
    setEndCurser = (end_curser) => {
        this.end_curser = end_curser
    }

    setInfluencerList = (InfluencerList) => {
        this.InfluencerList = InfluencerList
    }

    setisLoading = (loading) => {
        this.isLoading = loading
        this.refreshing = loading
    }
    setIsRefreshing = (refreshing) =>{
        this.refreshing = refreshing
    }
    setFetchingData = (fetching) => {
        this.fetchingNextPageData = fetching
    }
    getInfluencerList = () => {
        this.setisLoading(true)
        console.log("URL SORT BYYYY",this.Sortby);
        getAllInfluencer(this.hasNextPage,this.Sortby, this.userLatitute, this.userLongitude).then(response => {
            this.setisLoading(false)
            console.warn("response.data.message.length",response.data.message.length)
            if(this.Sortby===3&&response.data.message.length>0)
            {
               gettUserData().then(data => { 
                   if(data!==null)
                   {
                   const influencerlistdata = response.data.message.filter(el => el.ownerId!==data.ownerId)
                   influencerlistdata.splice(0, 0,{"avatarUrl": data.avatarUrl,"ownerId": data.ownerId} )
                   this.setInfluencerList(influencerlistdata)
                  }else{
                   this.setInfluencerList(response.data.message)

                 }
               })

             }else
            {              
               this.setInfluencerList(response.data.message)
            }
            // this.setInfluencerList(response.data.message)
            if (response.data.message.length === this.offSetlength) {
                this.hasNextPage = this.hasNextPage + response.data.message.length
            }
        })

    }

   

    getInfluencerNextPage = () => {
        this.setisLoading(false)
        this.setFetchingData(true)
        console.log('getAllInfluencer offset:',this.hasNextPage)

        getAllInfluencer(this.hasNextPage,this.Sortby,this.userLatitute, this.userLongitude).then(response => {
            let list = []
            if (response.data.message.length === this.offSetlength) {
                this.hasNextPage = this.hasNextPage + 1

                list = response.data.message ? [...this.InfluencerList, ...response.data.message] : this.InfluencerList

            } else {
                list = response.data.message ? [...this.InfluencerList, ...response.data.message] : this.InfluencerList
                this.setEndCurser(true)
            }
           // console.log('getAllInfluencer response, offset:',response,this.hasNextPage)

            this.hasNextPage = list.length
            this.setInfluencerList(list)
            this.setFetchingData(false)
        })
    }
}

decorate(InfluencerStore, {
    InfluencerList: observable,
    isLoading: observable,
    Sortby:observable,
    fetchingNextPageData:observable,
    userLatitute:observable,
    userLongitude:observable,
    refreshing: observable,
    showInfluencerSortPopup: observable,

    setInfluencerList: action,
    setisLoading: action,
    getInfluencerList: action,
    setHasNextPage: action,
    setEndCurser: action,
    setSortby:action,
    setFetchingData:action,
    setUserLocation:action,
    setIsRefreshing: action,
    setShowInfluencerPopup: action,


})
export default InfluencerStore
