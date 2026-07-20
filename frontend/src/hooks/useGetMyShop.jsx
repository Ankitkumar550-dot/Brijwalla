import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setGetMyShopData} from '../redux/ownerSlice'

function useGetMyShop() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          {
            withCredentials: true
          }
        )

        dispatch(setGetMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    if (userData && userData.role === 'owner') {
      fetchShop()
    } else {
      dispatch(setGetMyShopData(null))
    }
  }, [userData, dispatch])
}

export default useGetMyShop