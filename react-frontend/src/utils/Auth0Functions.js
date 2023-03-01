import {useAuth0} from '@auth0/auth0-react'

export function useAPI() {
    const {getAccessTokenSilently, loginWithRedirect} = useAuth0()
    
    async function getTokenFromAuth0({redirectURI='/callback'}={}) {
        let accessToken = ''
        try{
            accessToken = await getAccessTokenSilently()
        } catch(e) {
            // TODO: handle errors from getAccessTokenSilently
            if(e.error === 'login_required'){
                console.error(e)
                await loginWithRedirect({
                    appState: {
                        returnTo: `${redirectURI}`
                    }
                })
                accessToken = await getAccessTokenSilently()
            } else {
                throw e
            }
        }
        return accessToken
    }

    return getTokenFromAuth0
}
