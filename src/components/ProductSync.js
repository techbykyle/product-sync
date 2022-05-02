import React from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

const ProductSync = ({device, http, httpAction, tile, useHttp, useInterval}) => {

    const device_state = useSelector(state => state.DeviceController.data[tile.id], shallowEqual) || {}
    const user = useSelector(state => state.User)
    const api_result = device_state[http['waiting']]?.query_result.data.rows[0]?.count.toLocaleString('en', {useGrouping:true})
    const updated_api_result = device_state[http['last_updated']]?.query_result.data.rows[0]?.max
    const synced_api_result = device_state[http['last_sync']]?.query_result.data.rows[0]?.max
    const total_waiting = api_result && api_result > 0 ? api_result: 0
    const dispatch = useDispatch()

    let udate = 'No Updates Found'
    let sdate = 'No Sync Found'

    if(updated_api_result && updated_api_result > 0) {
        udate = new Date(updated_api_result * 1000).toLocaleDateString("en-US")
    }

    if(synced_api_result &&  synced_api_result > 0) {
        sdate = new Date(synced_api_result * 1000).toLocaleDateString("en-US")
    }

    useHttp(device.id, tile.id, http['waiting'])
    useHttp(device.id, tile.id, http['last_updated'])
    useHttp(device.id, tile.id, http['last_sync'])

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['waiting'])
    }, 30000, tile.id, http['waiting'])

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['last_updated'])
    }, 30000, tile.id, http['last_updated'])

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['last_sync'])
    }, 30000, tile.id, http['last_sync'])

    return (
        <div>
            <div 
                style={{marginRight: 10, marginBottom: 10}}
                className="float_l b f40 lightest_color badge bg-primary">
                {total_waiting}
            </div>
            <div>
                <p className="f18">Total Waiting to Sync</p>
                <p className="f14">Last Update: {udate}</p>
                <p className="f14">Last Sync: {sdate}</p>
            </div>
        </div>
    )
}

export default ProductSync