import './styles/main.css'
import { registerRoute, initRouter } from './lib/router.js'
import { mount as mountHome } from './modules/home.js'
import { mount as mountGame } from './modules/game.js'
import { mount as mountComplete } from './modules/complete.js'
import { mount as mountLeaderboard } from './modules/leaderboard.js'
import { mount as mountAdmin } from './modules/admin.js'

registerRoute('home', mountHome)
registerRoute('game', mountGame)
registerRoute('complete', mountComplete)
registerRoute('leaderboard', mountLeaderboard)
registerRoute('admin', mountAdmin)

initRouter()
