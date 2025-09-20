'use client'

import { useState, useEffect } from 'react'
import { BookOpen, User, Lock, BarChart3, Trophy, Target, Award, Eye, EyeOff, Clock, Play, FileText, Timer, CheckCircle, Settings, Users, Shield, UserCheck, UserX, Edit3, Save, X, Plus, Mail, ExternalLink } from 'lucide-react'

interface Student {
  id: number
  name: string
  score: number
  isAnonymous: boolean
}

interface SubjectProgress {
  name: string
  progress: number
  color: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface PendingUser {
  id: number
  name: string
  email: string
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected'
  password?: string
  progress?: SubjectProgress[]
}

interface AppSettings {
  appName: string
  welcomeMessage: string
  maxUsers: number
  registrationEnabled: boolean
}

export default function EducationalApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'student'>('student')
  const [currentUser, setCurrentUser] = useState<PendingUser | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [editingSettings, setEditingSettings] = useState(false)

  // Estados para adicionar usuário
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [showNewUserPassword, setShowNewUserPassword] = useState(false)

  // Estados do Admin com progresso individual para cada usuário
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    { 
      id: 1, 
      name: 'João Silva', 
      email: 'joao@email.com', 
      registrationDate: '20/12/2024', 
      status: 'pending',
      password: 'joao123',
      progress: [
        { name: 'Matemática', progress: 65, color: '#EF4444' },
        { name: 'Ciências da Natureza', progress: 45, color: '#10B981' },
        { name: 'Ciências Humanas', progress: 70, color: '#F59E0B' },
        { name: 'Linguagens', progress: 55, color: '#F97316' },
        { name: 'Redação', progress: 40, color: '#3B82F6' }
      ]
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      email: 'maria@email.com', 
      registrationDate: '19/12/2024', 
      status: 'pending',
      password: 'maria123',
      progress: [
        { name: 'Matemática', progress: 80, color: '#EF4444' },
        { name: 'Ciências da Natureza', progress: 75, color: '#10B981' },
        { name: 'Ciências Humanas', progress: 90, color: '#F59E0B' },
        { name: 'Linguagens', progress: 85, color: '#F97316' },
        { name: 'Redação', progress: 70, color: '#3B82F6' }
      ]
    },
    { 
      id: 3, 
      name: 'Pedro Costa', 
      email: 'pedro@email.com', 
      registrationDate: '18/12/2024', 
      status: 'approved',
      password: 'pedro123',
      progress: [
        { name: 'Matemática', progress: 50, color: '#EF4444' },
        { name: 'Ciências da Natureza', progress: 60, color: '#10B981' },
        { name: 'Ciências Humanas', progress: 45, color: '#F59E0B' },
        { name: 'Linguagens', progress: 55, color: '#F97316' },
        { name: 'Redação', progress: 35, color: '#3B82F6' }
      ]
    },
    { 
      id: 4, 
      name: 'Ana Oliveira', 
      email: 'ana@email.com', 
      registrationDate: '17/12/2024', 
      status: 'rejected',
      password: 'ana123',
      progress: [
        { name: 'Matemática', progress: 95, color: '#EF4444' },
        { name: 'Ciências da Natureza', progress: 88, color: '#10B981' },
        { name: 'Ciências Humanas', progress: 92, color: '#F59E0B' },
        { name: 'Linguagens', progress: 90, color: '#F97316' },
        { name: 'Redação', progress: 85, color: '#3B82F6' }
      ]
    }
  ])

  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'PAINEL ESTUDANTE',
    welcomeMessage: 'Estude agora, o tempo está acabando!',
    maxUsers: 100,
    registrationEnabled: true
  })

  // Contador regressivo - de hoje até 09/10/2025
  useEffect(() => {
    const targetDate = new Date('2025-10-09T00:00:00').getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Função para gerar progresso padrão para novos usuários
  const generateDefaultProgress = (): SubjectProgress[] => [
    { name: 'Matemática', progress: Math.floor(Math.random() * 30) + 20, color: '#EF4444' },
    { name: 'Ciências da Natureza', progress: Math.floor(Math.random() * 30) + 20, color: '#10B981' },
    { name: 'Ciências Humanas', progress: Math.floor(Math.random() * 30) + 20, color: '#F59E0B' },
    { name: 'Linguagens', progress: Math.floor(Math.random() * 30) + 20, color: '#F97316' },
    { name: 'Redação', progress: Math.floor(Math.random() * 30) + 20, color: '#3B82F6' }
  ]

  const topStudents: Student[] = [
    { id: 1, name: 'Ana Silva', score: 950, isAnonymous: false },
    { id: 2, name: 'Usuário Anônimo', score: 920, isAnonymous: true },
    { id: 3, name: 'Carlos Santos', score: 890, isAnonymous: false },
    { id: 4, name: 'Usuário Anônimo', score: 875, isAnonymous: true },
    { id: 5, name: 'Maria Oliveira', score: 860, isAnonymous: false }
  ]

  const recentScores = [
    { subject: 'Matemática', score: 85, date: '15/12/2024' },
    { subject: 'Redação', score: 78, date: '14/12/2024' },
    { subject: 'Ciências Humanas', score: 92, date: '13/12/2024' }
  ]

  const subjects = [
    { 
      name: 'Matemática e suas Tecnologias', 
      color: 'bg-red-600 hover:bg-red-700', 
      icon: '📐',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      link: 'https://myfanbarbara.my.canva.site/resumo-de-p-gina-web-sobre-matem-tica'
    },
    { 
      name: 'Ciências da Natureza e suas Tecnologias', 
      color: 'bg-green-600 hover:bg-green-700', 
      icon: '🧪',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      link: 'https://mgx-kv0rk9w7qhs.mgx.world'
    },
    { 
      name: 'Ciências Humanas e suas Tecnologias', 
      color: 'bg-yellow-600 hover:bg-yellow-700', 
      icon: '🌍',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      link: 'https://mgx-zg17u50zwrg.mgx.world'
    },
    { 
      name: 'Linguagens, Códigos e suas Tecnologias', 
      color: 'bg-orange-600 hover:bg-orange-700', 
      icon: '📚',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      link: null // Sem link específico fornecido
    },
    { 
      name: 'Redação', 
      color: 'bg-blue-600 hover:bg-blue-700', 
      icon: '✍️',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      link: 'https://mgx-xou6sidjg1b.mgx.world'
    }
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      // Admin login: admin@admin.com / admin123
      if (email === 'admin@admin.com' && password === 'admin123') {
        setUserRole('admin')
        setIsLoggedIn(true)
        setActiveTab('admin-users')
        setCurrentUser(null)
      } else {
        // Verificar se usuário está aprovado e senha está correta
        const user = pendingUsers.find(u => u.email === email && u.status === 'approved' && u.password === password)
        if (user) {
          setUserRole('student')
          setIsLoggedIn(true)
          setActiveTab('dashboard')
          setCurrentUser(user)
        } else {
          alert('E-mail, senha incorretos ou usuário não autorizado.')
        }
      }
    }
  }

  const handleUserAction = (userId: number, action: 'approve' | 'reject') => {
    setPendingUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'approve' ? 'approved' : 'rejected' }
          : user
      )
    )
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUserName && newUserEmail && newUserPassword) {
      // Verificar se email já existe
      const emailExists = pendingUsers.some(user => user.email === newUserEmail)
      if (emailExists) {
        alert('Este e-mail já está cadastrado no sistema.')
        return
      }

      // Adicionar novo usuário com progresso individual
      const newUser: PendingUser = {
        id: Math.max(...pendingUsers.map(u => u.id)) + 1,
        name: newUserName,
        email: newUserEmail,
        registrationDate: new Date().toLocaleDateString('pt-BR'),
        status: 'approved', // Usuários criados pelo admin são aprovados automaticamente
        password: newUserPassword,
        progress: generateDefaultProgress()
      }

      setPendingUsers(prev => [...prev, newUser])
      
      // Limpar formulário
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPassword('')
      setShowAddUserForm(false)
      
      alert(`Usuário ${newUserName} adicionado com sucesso! Login: ${newUserEmail} | Senha: ${newUserPassword}`)
    }
  }

  const handleSubjectClick = (subject: string, link: string | null) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    } else {
      alert(`Conteúdo de ${subject} em breve!`)
    }
  }

  const handleSimulado = () => {
    alert('Iniciando simulado do ENEM...')
  }

  const handleSaveSettings = () => {
    setEditingSettings(false)
    alert('Configurações salvas com sucesso!')
  }

  // Componente de Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-4xl font-bold mb-6 tracking-wide">{appSettings.appName}</h1>
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full mb-8"></div>
          </div>

          {/* Contador Regressivo */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Contagem Regressiva</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-500">{timeLeft.days}</div>
                <div className="text-xs text-gray-400">DIAS</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-500">{timeLeft.hours}</div>
                <div className="text-xs text-gray-400">HORAS</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-500">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-400">MIN</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-500">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-400">SEG</div>
              </div>
            </div>
            
            <p className="text-red-400 font-semibold text-lg animate-pulse">
              {appSettings.welcomeMessage}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  E-mail
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Principal
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {userRole === 'admin' ? (
                <Shield className="w-8 h-8 text-red-500" />
              ) : (
                <BookOpen className="w-8 h-8 text-blue-500" />
              )}
              <h1 className="text-xl font-bold">
                {userRole === 'admin' ? 'PAINEL ADMINISTRATIVO' : appSettings.appName}
              </h1>
              {currentUser && (
                <span className="text-sm text-gray-400">
                  Olá, {currentUser.name}!
                </span>
              )}
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-2 sm:space-x-4">
              {userRole === 'admin' ? (
                <></>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('simulado')}
                    className={`px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      activeTab === 'simulado' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    Simulados
                  </button>
                </>
              )}
            </nav>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PAINEL ADMINISTRATIVO */}
        {userRole === 'admin' && activeTab === 'admin-users' && (
          <section>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-red-500" />
                    Gerenciamento de Usuários
                  </h2>
                  <p className="text-gray-400">Autorize ou rejeite o acesso de novos usuários ao sistema.</p>
                </div>
                <button
                  onClick={() => setShowAddUserForm(true)}
                  className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Usuário</span>
                </button>
              </div>
            </div>

            {/* Modal para Adicionar Usuário */}
            {showAddUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center">
                      <Plus className="w-6 h-6 mr-2 text-green-500" />
                      Adicionar Usuário
                    </h3>
                    <button
                      onClick={() => setShowAddUserForm(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleAddUser} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Digite o nome completo"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Digite o e-mail"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showNewUserPassword ? 'text' : 'password'}
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Digite a senha"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showNewUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                      >
                        Adicionar Usuário
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUserForm(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {pendingUsers.filter(u => u.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Aprovados</p>
                    <p className="text-2xl font-bold text-green-500">
                      {pendingUsers.filter(u => u.status === 'approved').length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Rejeitados</p>
                    <p className="text-2xl font-bold text-red-500">
                      {pendingUsers.filter(u => u.status === 'rejected').length}
                    </p>
                  </div>
                  <UserX className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-blue-500">{pendingUsers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Lista de Usuários com Progresso Individual */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold">Lista de Usuários e Progresso Individual</h3>
              </div>
              
              <div className="space-y-6 p-6">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    {/* Informações do Usuário */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">{user.name}</h4>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">Cadastrado em: {user.registrationDate}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          user.status === 'approved' ? 'bg-green-900 text-green-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {user.status === 'pending' ? 'Pendente' :
                           user.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </span>
                      </div>
                      
                      {/* Ações */}
                      {user.status === 'pending' && (
                        <div className="flex space-x-2 mt-4 lg:mt-0">
                          <button
                            onClick={() => handleUserAction(user.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Aprovar</span>
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <UserX className="w-4 h-4" />
                            <span>Rejeitar</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progresso Individual do Usuário */}
                    {user.progress && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Progresso Individual por Disciplina
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {user.progress.map((subject, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-white">{subject.name}</span>
                                <span className="text-sm text-gray-300">{subject.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${subject.progress}%`,
                                    backgroundColor: subject.color
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Média do Usuário */}
                        <div className="mt-4 text-center">
                          <span className="text-sm text-gray-400">
                            Progresso Médio: {Math.round(user.progress.reduce((acc, curr) => acc + curr.progress, 0) / user.progress.length)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONFIGURAÇÕES ADMINISTRATIVAS */}
        {userRole === 'admin' && activeTab === 'admin-settings' && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Settings className="w-8 h-8 mr-3 text-red-500" />
                Configurações do Sistema
              </h2>
              <p className="text-gray-400">Personalize as configurações gerais do aplicativo.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Configurações Gerais</h3>
                {!editingSettings ? (
                  <button
                    onClick={() => setEditingSettings(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveSettings}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                    <button
                      onClick={() => setEditingSettings(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Nome do Aplicativo
                  </label>
                  <input
                    type="text"
                    value={appSettings.appName}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, appName: e.target.value }))}
                    disabled={!editingSettings}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Máximo de Usuários
                  </label>
                  <input
                    type="number"
                    value={appSettings.maxUsers}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                    disabled={!editingSettings}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Mensagem de Boas-vindas
                  </label>
                  <textarea
                    value={appSettings.welcomeMessage}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    disabled={!editingSettings}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={appSettings.registrationEnabled}
                      onChange={(e) => setAppSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                      disabled={!editingSettings}
                      className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-gray-300">Permitir novos registros</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DASHBOARD DO ESTUDANTE */}
        {userRole === 'student' && activeTab === 'dashboard' && (
          <>
            {/* Matérias - Cards Quadrados */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Áreas de Conhecimento</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    onClick={() => handleSubjectClick(subject.name, subject.link)}
                    className={`${subject.color} rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl aspect-square flex flex-col justify-between relative overflow-hidden`}
                  >
                    {/* Imagem de fundo */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-20"
                      style={{ backgroundImage: `url(${subject.image})` }}
                    ></div>
                    
                    {/* Conteúdo */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="text-center">
                        <span className="text-4xl mb-3 block">{subject.icon}</span>
                        <h3 className="font-bold text-lg text-white leading-tight">{subject.name}</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-white/90 text-sm font-medium mb-2">
                          {subject.link ? 'Clique para acessar' : 'Em breve'}
                        </p>
                        {subject.link && (
                          <div className="flex items-center justify-center text-white/80">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Linha Divisória */}
            <div className="border-t border-gray-700 mb-12 mx-auto w-3/4"></div>

            {/* Progresso e Resultados */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Gráfico de Progresso Individual do Usuário Logado */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                  Seu Progresso por Disciplina
                </h3>
                <div className="space-y-4">
                  {currentUser?.progress?.map((subject, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-400">{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${subject.progress}%`,
                            backgroundColor: subject.color
                          }}
                        ></div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-400 text-center">Dados de progresso não disponíveis</p>
                  )}
                </div>
                
                {/* Progresso Médio do Usuário */}
                {currentUser?.progress && (
                  <div className="mt-6 text-center p-4 bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Seu Progresso Médio</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {Math.round(currentUser.progress.reduce((acc, curr) => acc + curr.progress, 0) / currentUser.progress.length)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-green-500" />
                    Nota Atual
                  </h3>
                  <div className="text-4xl font-bold text-green-500">847</div>
                  <p className="text-gray-400 text-sm">Pontos ENEM</p>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-yellow-500" />
                    Pontuação Acumulada
                  </h3>
                  <div className="text-4xl font-bold text-yellow-500">12,450</div>
                  <p className="text-gray-400 text-sm">Pontos totais</p>
                </div>
              </div>
            </section>

            {/* Ranking e Últimas Pontuações */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Ranking */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Ranking dos Melhores
                </h3>
                <div className="space-y-3">
                  {topStudents.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={student.isAnonymous ? 'text-gray-400' : 'text-white'}>
                          {student.name}
                        </span>
                      </div>
                      <span className="font-bold text-blue-400">{student.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimas Pontuações */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-6">Últimas Pontuações</h3>
                <div className="space-y-3">
                  {recentScores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                      <div>
                        <div className="font-medium">{score.subject}</div>
                        <div className="text-sm text-gray-400">{score.date}</div>
                      </div>
                      <div className="text-xl font-bold text-green-500">{score.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* SIMULADOS DO ESTUDANTE */}
        {userRole === 'student' && activeTab === 'simulado' && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Simulado ENEM</h2>
              
              {/* Cards de Simulados - Mobile Optimized */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Simulado Completo */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                  <div className="text-center mb-4">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                    <h3 className="text-xl font-bold mb-2">Simulado Completo</h3>
                    <p className="text-gray-400 text-sm mb-4">180 questões • 5h30min</p>
                  </div>
                  <button
                    onClick={handleSimulado}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Iniciar</span>
                  </button>
                </div>

                {/* Simulado Rápido */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                  <div className="text-center mb-4">
                    <Timer className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <h3 className="text-xl font-bold mb-2">Simulado Rápido</h3>
                    <p className="text-gray-400 text-sm mb-4">45 questões • 1h30min</p>
                  </div>
                  <button
                    onClick={handleSimulado}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Iniciar</span>
                  </button>
                </div>

                {/* Simulado por Área */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105 md:col-span-2 lg:col-span-1">
                  <div className="text-center mb-4">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                    <h3 className="text-xl font-bold mb-2">Por Área</h3>
                    <p className="text-gray-400 text-sm mb-4">Escolha a matéria • Flexível</p>
                  </div>
                  <button
                    onClick={handleSimulado}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Escolher</span>
                  </button>
                </div>
              </div>

              {/* Estatísticas de Simulados - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">12</div>
                  <div className="text-sm text-gray-400">Simulados Feitos</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">847</div>
                  <div className="text-sm text-gray-400">Melhor Nota</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-yellow-500 mb-1">78%</div>
                  <div className="text-sm text-gray-400">Taxa de Acerto</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-1">3°</div>
                  <div className="text-sm text-gray-400">Posição Ranking</div>
                </div>
              </div>

              {/* Dicas para Mobile */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4 text-center">💡 Dicas para o Simulado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Use um ambiente silencioso e bem iluminado</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Mantenha o celular no modo avião durante o teste</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Faça pausas de 5 minutos a cada hora</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Revise suas respostas antes de finalizar</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Rodapé */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-center">
              Criado pela empresa Digital Results junto com a Lasy.ia
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl filter drop-shadow-lg">🦁</span>
              </div>
              <div className="text-sm">
                <div className="font-bold text-white tracking-wide">DIGITAL RESULTS</div>
                <div className="text-gray-400 text-xs">Powered by Neon Graphics</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}