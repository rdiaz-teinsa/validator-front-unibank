import mock from '@/@fake-db/mock'

// Lightweight token helpers for browser-only dev mocks (no jsonwebtoken)
const TOKEN_PREFIX = 'mock.'
const createToken = (payload = {}, expiresInMs = 10 * 60 * 1000) => {
  const data = { ...payload, exp: Date.now() + expiresInMs }
  try {
    return TOKEN_PREFIX + btoa(JSON.stringify(data))
  } catch (e) {
    return TOKEN_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  }
}
const verifyToken = token => {
  if (!token || typeof token !== 'string' || !token.startsWith(TOKEN_PREFIX)) {
    throw new Error('Invalid token')
  }
  let json
  try {
    json = atob(token.slice(TOKEN_PREFIX.length))
  } catch (e) {
    throw new Error('Invalid token encoding')
  }
  const data = JSON.parse(json)
  if (!data.exp || Date.now() > data.exp) throw new Error('Token expired')
  return data
}

const data = {
  users: [
    {
      id: 1,
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'admin',
      // eslint-disable-next-line global-require
      avatar: require('@/assets/images/avatars/13-small.png'),
      email: 'admin@demo.com',
      role: 'admin',
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
      extras: {
        eCommerceCartItemsCount: 5,
      },
    },
    {
      id: 2,
      fullName: 'Jane Doe',
      username: 'janedoe',
      password: 'client',
      // eslint-disable-next-line global-require
      avatar: require('@/assets/images/avatars/1-small.png'),
      email: 'client@demo.com',
      role: 'client',
      ability: [
        {
          action: 'read',
          subject: 'ACL',
        },
        {
          action: 'read',
          subject: 'Auth',
        },
      ],
      extras: {
        eCommerceCartItemsCount: 5,
      },
    },
  ],
}

// ! These two secrets shall be in .env file and not in any other file
const jwtConfig = {
  expireMs: 10 * 60 * 1000,
  refreshExpireMs: 7 * 24 * 60 * 60 * 1000,
}

mock.onPost('/jwt/login').reply(request => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong'],
  }

  const user = data.users.find(u => u.email === email && u.password === password)

  if (user) {
    const accessToken = createToken({ id: user.id }, jwtConfig.expireMs)
    const refreshToken = createToken({ id: user.id }, jwtConfig.refreshExpireMs)

    const userData = { ...user }
    delete userData.password

    const response = {
      userData,
      accessToken,
      refreshToken,
    }

    return [200, response]
  } else {
    error = {
      email: ['Email or Password is Invalid'],
    }
  }

  return [400, { error }]
})

mock.onPost('/jwt/register').reply(request => {
  const { username, email, password } = JSON.parse(request.data)

  // If not any of data is missing return 400
  if (!(username && email && password)) return [400]

  const isEmailAlreadyInUse = data.users.find(user => user.email === email)
  const isUsernameAlreadyInUse = data.users.find(user => user.username === username)

  const error = {
    password: !password ? ['Please enter password'] : null,
    email: (() => {
      if (!email) return ['Please enter your email.']
      if (isEmailAlreadyInUse) return ['This email is already in use.']
      return null
    })(),
    username: (() => {
      if (!username) return ['Please enter your username.']
      if (isUsernameAlreadyInUse) return ['This username is already in use.']
      return null
    })(),
  }

  if (!error.username && !error.email) {
    const userData = {
      email,
      password,
      username,
      fullName: '',
      avatar: null,
      role: 'admin',
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
    }

    // Add user id
    const { length } = data.users
    let lastIndex = 0
    if (length) {
      lastIndex = data.users[length - 1].id
    }
    userData.id = lastIndex + 1

    data.users.push(userData)

    const accessToken = createToken({ id: userData.id }, jwtConfig.expireMs)

    const user = { ...userData }
    delete user.password
    const response = {
      userData: user,
      accessToken,
    }

    return [200, response]
  }
  return [400, { error }]
})

mock.onPost('/jwt/refresh-token').reply(request => {
  const { refreshToken } = JSON.parse(request.data)

  try {
    const { id } = verifyToken(refreshToken)
    const userData = { ...data.users.find(user => user.id === id) }

    const newAccessToken = createToken({ id: userData.id }, jwtConfig.expireMs)
    const newRefreshToken = createToken({ id: userData.id }, jwtConfig.refreshExpireMs)

    delete userData.password
    const response = {
      userData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
    return [200, response]
  } catch (e) {
    const error = 'Invalid refresh token'
    return [401, { error }]
  }
})
