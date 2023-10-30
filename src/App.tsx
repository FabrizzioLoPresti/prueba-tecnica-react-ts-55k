import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types/types.d'
import UserList from './components/user-list'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://randomuser.me/api/?results=100')
        const { results } = await res.json() as { results: User[] }
        setUsers(results)
        originalUsers.current = results
      } catch (error) {
        console.log(error)
      }
    }
    fetchUsers()
  }, [])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    sorting === SortBy.NONE ? setSorting(SortBy.COUNTRY) : setSorting(SortBy.NONE)
  }

  const handleDeleteUser = (uuid: string) => {
    const filteredUsers = users.filter(user => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  const handleResetData = () => {
    setUsers(originalUsers.current)
  }

  const handleFilterByCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFilterByCountry(value)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const filteredUsers = useMemo(() => {
    return typeof filterByCountry === 'string' && filterByCountry.length > 0
      ? users.filter(user => user.location.country.toLowerCase().includes(filterByCountry.toLowerCase()))
      : users
  }, [users, filterByCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
      [SortBy.COUNTRY]: user => user.location.country
    }

    // New Array Method -> MDN Developer Mozilla
    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>Prueba Tecnica</h1>
      <header>
        <button onClick={toggleColors}>
          {
            showColors
              ? 'Ocultar colores'
              : 'Mostrar colores'
          }
        </button>

        <button onClick={toggleSortByCountry}>
          {
            sorting === SortBy.COUNTRY
              ? 'Reiniciar'
              : 'Ordenar por pais'
          }
        </button>

        <button onClick={handleResetData}>
          Restaurar datos
        </button>

        <input type="text" name="filter-country" id="filter-country" onChange={handleFilterByCountry} placeholder='Filtra por pais' />
      </header>
      <main>
        <UserList users={sortedUsers} showColors={showColors} handleDeleteUser={handleDeleteUser} handleChangeSort={handleChangeSort} />
      </main>
    </>
  )
}

export default App
