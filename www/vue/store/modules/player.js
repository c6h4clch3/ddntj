import jsonp from 'jsonp';

// プレイヤー情報管理ストアモジュール
export default {
  namespaced: true,
  state: {
    name: '',
    systems: [],
    selectedSystem: 'DiceBot',
  },
  actions: {
    initialize(context) {
      const name = Math.floor(Math.random() * 100) + 'さん';
      context.commit('name', name);
      let systems
      jsonp(
        'https://www2.taruki.com/bcdice-api/v1/systems?callback=',
        null,
        function(err, data){
          if (err) {
            return context.state.systems;
          }
          systems = data.systems;
          context.commit('initialize', {
            name: name,
            systems: systems,
            selectedSystem: 'DiceBot'
          });
        }
      );
    },
    name(context, name) {
      context.commit('name', name);
    },
    selectedSystem(context, system) {
      context.commit('selectedSystem', system);
    }
  },
  mutations: {
    initialize(state, initialParams) {
      state.name = initialParams.name;
      state.systems = initialParams.systems;
      state.selectedSystem = initialParams.selectedSystem;
    },
    name(state, name) {
      state.name = name;
    },
    selectedSystem(state, system) {
      state.selectedSystem = system;
    }
  }
}
