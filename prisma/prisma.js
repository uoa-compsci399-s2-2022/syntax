import { PrismaClient } from '@prisma/client'
let prisma
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
	log: [
	  {
		 emit: 'event',
		 level: 'query',
	  },
	  {
		 emit: 'stdout',
		 level: 'error',
	  },
	  {
		 emit: 'stdout',
		 level: 'info',
	  },
	  {
		 emit: 'stdout',
		 level: 'warn',
	  },
	],
 })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
		log: [
		  {
			 emit: 'event',
			 level: 'query',
		  },
		  {
			 emit: 'stdout',
			 level: 'error',
		  },
		  {
			 emit: 'stdout',
			 level: 'info',
		  },
		  {
			 emit: 'stdout',
			 level: 'warn',
		  },
		],
	 })
  }
  prisma = global.prisma
}
// prisma.$on('query', (e) => {
// 	console.log('Query: ' + e.query)
//  })
export default prisma