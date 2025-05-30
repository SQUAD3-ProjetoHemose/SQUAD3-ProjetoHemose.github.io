'use client';

import { useState, useEffect } from 'react';
import { Stats, FilaEspera } from '@/types';
import usePacienteStore from '@/store/pacienteStore';
import { useAuthentication } from '@/hooks';

// Interface para agendamentos futuros
interface AgendamentoFuturo {
  id: number;
  data: string;
  horario: string;
  paciente: string;
  tipo: string;
  medico: string;
}

function RecepcionistaDashboardPage() {
  // Obter o usuário do contexto de autenticação
  const { user } = useAuthentication();
  
  // Estados para armazenar dados dinâmicos da recepção
  const [stats, setStats] = useState<Stats>({
    pacientesInternados: 0,
    pacientesTriagem: 0,
    medicamentosAdministrar: 0,
    leitosDisponiveis: 0,
    pacientesHoje: 0,
    agendamentosHoje: 0,
    pacientesAguardando: 0,
    proximosAgendamentos: 0,
  });

  const [filaEspera, setFilaEspera] = useState<FilaEspera[]>([]);
  const [proximosAgendamentos, setProximosAgendamentos] = useState<AgendamentoFuturo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { pacientes, fetchPacientes, loading: loadingPacientes } = usePacienteStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Função para carregar todos os dados da dashboard
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        
        // Buscar pacientes reais para utilizar nos dados simulados
        await fetchPacientes();
        
        // Dados estatísticos - simulados mas baseados em dados reais quando possível
        setStats({
          pacientesInternados: Math.floor(Math.random() * 15) + 5,
          pacientesTriagem: Math.floor(Math.random() * 8) + 2,
          medicamentosAdministrar: Math.floor(Math.random() * 20) + 10,
          leitosDisponiveis: Math.floor(Math.random() * 12) + 3,
          pacientesHoje: pacientes.length > 0 ? Math.min(pacientes.length * 2, 24) : 24,
          agendamentosHoje: pacientes.length > 0 ? Math.min(pacientes.length * 3, 35) : 35,
          pacientesAguardando: pacientes.length > 0 ? Math.min(pacientes.length / 2, 6) : 6,
          proximosAgendamentos: pacientes.length > 0 ? Math.min(pacientes.length, 12) : 12,
        });

        // Fila de espera - utilizando nomes de pacientes reais quando disponíveis
        setFilaEspera([
          { 
            id: 1, 
            nome: pacientes[0]?.nome || 'José Silva', 
            horario: '11:30', 
            tipo: 'Consulta', 
            medico: 'Dr. Carlos Santos', 
            status: 'Aguardando',
            prioridade: 'Normal',
            chegada: '11:25'
          },
          { 
            id: 2, 
            nome: pacientes[1]?.nome || 'Fernanda Lima', 
            horario: '11:45', 
            tipo: 'Retorno', 
            medico: 'Dra. Ana Oliveira', 
            status: 'Triagem',
            prioridade: 'Alta'
          },
          { 
            id: 3, 
            nome: pacientes[2]?.nome || 'Ricardo Souza', 
            horario: '12:00', 
            tipo: 'Exame', 
            medico: 'Dr. Paulo Mendes', 
            status: 'Aguardando',
            prioridade: 'Normal'
          },
          { 
            id: 4, 
            nome: pacientes[3]?.nome || 'Camila Ferreira', 
            horario: '12:15', 
            tipo: 'Consulta', 
            medico: 'Dra. Mariana Costa', 
            status: 'Aguardando',
            prioridade: 'Urgente'
          },
          { 
            id: 5, 
            nome: pacientes[4]?.nome || 'Eduardo Martins', 
            horario: '12:30', 
            tipo: 'Consulta', 
            medico: 'Dr. Carlos Santos', 
            status: 'Aguardando',
            prioridade: 'Baixa'
          },
          { 
            id: 6, 
            nome: pacientes[5]?.nome || 'Luciana Alves', 
            horario: '12:45', 
            tipo: 'Retorno', 
            medico: 'Dra. Ana Oliveira', 
            status: 'Aguardando',
            prioridade: 'Normal'
          },
        ]);

        // Agendamentos futuros - utilizando nomes de pacientes reais quando disponíveis
        setProximosAgendamentos([
          { id: 1, data: '29/04/2025', horario: '09:00', paciente: pacientes[6]?.nome || 'Antônio Gomes', tipo: 'Consulta', medico: 'Dr. Carlos Santos' },
          { id: 2, data: '29/04/2025', horario: '10:30', paciente: pacientes[7]?.nome || 'Juliana Mendes', tipo: 'Retorno', medico: 'Dra. Ana Oliveira' },
          { id: 3, data: '29/04/2025', horario: '14:15', paciente: pacientes[8]?.nome || 'Roberto Almeida', tipo: 'Exame', medico: 'Dr. Paulo Mendes' }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [fetchPacientes, pacientes.length]);

  // Função para obter cor da prioridade
  const getPrioridadeColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'Urgente': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Exibe loader enquanto os dados estão carregando
  if (isLoading || loadingPacientes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="ml-2 text-purple-700">Carregando dados...</p>
      </div>
    );
  }

  // Manipulador para atualizar a fila (simulado)
  const handleAtualizarFila = () => {
    // Em um sistema real, isso buscaria os dados mais recentes da API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Manipulador para busca (simulado)
  const handleSearch = () => {
    // Em um sistema real, isso buscaria pacientes na API
    if (searchTerm.trim() === '') return;
    
    alert(`Buscando por: ${searchTerm}`);
    setSearchTerm('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Dashboard de Recepção</h1>
      
      {/* Opcional: mostrar nome do recepcionista */}
      {user && (
        <p className="text-black mb-4">Olá, {user.nome}. Bem-vindo(a)!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-black">Pacientes Hoje</h2>
          <p className="text-3xl font-bold text-black">{stats.pacientesHoje}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-black">Agendamentos Hoje</h2>
          <p className="text-3xl font-bold text-black">{stats.agendamentosHoje}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-black">Aguardando Atendimento</h2>
          <p className="text-3xl font-bold text-black">{stats.pacientesAguardando}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-black">Próximos Agendamentos</h2>
          <p className="text-3xl font-bold text-black">{stats.proximosAgendamentos}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">Fila de Espera</h2>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 bg-purple-700 text-white rounded text-sm hover:bg-purple-800"
                onClick={handleAtualizarFila}
              >
                Atualizar
              </button>
              <button className="px-3 py-1 bg-purple-700 text-white rounded text-sm hover:bg-purple-800">
                Gerenciar Fila
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-200">
                {filaEspera.map((paciente) => (
                  <tr key={paciente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{paciente.nome}</div>
                      {paciente.chegada && (
                        <div className="text-xs text-gray-500">Chegou: {paciente.chegada}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{paciente.horario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{paciente.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{paciente.medico}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        paciente.status === 'Aguardando' ? 'bg-purple-100 text-black' :
                        paciente.status === 'Triagem' ? 'bg-purple-200 text-black' :
                        paciente.status === 'Em Atendimento' ? 'bg-purple-300 text-black' :
                        'bg-purple-100 text-black'
                      }`}>
                        {paciente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paciente.prioridade && (
                        <span className={`px-2 py-1 text-xs rounded-full ${getPrioridadeColor(paciente.prioridade)}`}>
                          {paciente.prioridade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-xs">
                        Check-in
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-black mb-4">Ações Rápidas</h2>

          <div className="space-y-3">
            <a href="/recepcionista/pacientes/novo" className="block w-full text-center bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
              Novo Paciente
            </a>
            <a href="/recepcionista/agendamentos/novo" className="block w-full text-center bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
              Novo Agendamento
            </a>
            <a href="/recepcionista/check-in" className="block w-full text-center bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
              Check-in de Paciente
            </a>
            <a href="/recepcionista/acompanhantes/novo" className="block w-full text-center bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
              Cadastrar Acompanhante
            </a>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-black mb-2">Busca Rápida</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Nome ou CPF do paciente"
                className="flex-1 px-3 py-2 border border-purple-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 placeholder:text-[#333333]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800"
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-black mb-4">Próximos Agendamentos</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Médico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-200">
              {proximosAgendamentos.map((agendamento) => (
                <tr key={agendamento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{agendamento.data}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{agendamento.horario}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">{agendamento.paciente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{agendamento.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">{agendamento.medico}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-black hover:text-gray-700">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <a href="/recepcionista/agendamentos" className="text-black hover:underline text-sm font-medium">
            Ver todos os agendamentos →
          </a>
        </div>
      </div>
    </div>
  );
}

// Exportar diretamente sem HOC, pois a proteção já está no layout
export default RecepcionistaDashboardPage;
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

*/