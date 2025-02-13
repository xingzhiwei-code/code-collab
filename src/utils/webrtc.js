const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }
  ]
}

export const createPeerConnection = () => {
  const peerConnection = new RTCPeerConnection(ICE_SERVERS)

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // 在这里处理ICE候选，可以通过信令服务器发送给对等端
      console.log('New ICE candidate:', event.candidate)
    }
  }

  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState)
  }

  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE connection state:', peerConnection.iceConnectionState)
  }

  return peerConnection
}

export const createOffer = async (peerConnection) => {
  try {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    return offer
  } catch (error) {
    console.error('Error creating offer:', error)
    throw error
  }
}

export const handleAnswer = async (peerConnection, answer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  } catch (error) {
    console.error('Error handling answer:', error)
    throw error
  }
}

export const handleOffer = async (peerConnection, offer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer
  } catch (error) {
    console.error('Error handling offer:', error)
    throw error
  }
}

export const addIceCandidate = async (peerConnection, candidate) => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  } catch (error) {
    console.error('Error adding ICE candidate:', error)
    throw error
  }
}