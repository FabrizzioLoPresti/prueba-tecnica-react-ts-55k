import { SortBy, type User } from '../types/types.d'

interface Props {
  users: User[]
  showColors: boolean
  handleDeleteUser: (uuid: string) => void
  handleChangeSort: (sort: SortBy) => void
}

const UserList = ({ users, showColors, handleDeleteUser, handleChangeSort }: Props) => {
  return (
    <table width={'100%'}>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => { handleChangeSort(SortBy.NAME) }}>Nombre</th>
          <th className='pointer' onClick={() => { handleChangeSort(SortBy.LAST) }}>Apellido</th>
          <th className='pointer' onClick={() => { handleChangeSort(SortBy.COUNTRY) }}>Pais</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map((user, index) => (
            <tr key={user.login.uuid} style={{ backgroundColor: showColors ? (index % 2 === 0 ? '#333' : '#555') : 'transparent' }}>
              <td>
                <img src={user.picture.thumbnail} alt={user.name.first} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => { handleDeleteUser(user.login.uuid) }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default UserList
