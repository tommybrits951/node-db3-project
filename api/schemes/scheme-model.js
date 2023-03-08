const db = require('../../data/db-config')


async function find() { // EXERCISE A
 const schemes = await db('schemes as sc')
 .leftJoin('steps as st', "sc.scheme_id", "=", "st.scheme_id")
 .select('sc.*')
 .count('st.step_id as number_of_steps')
 .groupBy('sc.scheme_id')
  
  console.log(schemes);
  return schemes;
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
}

async function findById(scheme_id) { // EXERCISE B
  const schemes = await db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
  .where(`sc.scheme_id`, scheme_id)
  .select('sc.scheme_name', 'st.*', 'sc.scheme_id')
  .orderBy('st.step_number')
  const result = {
    scheme_id: schemes[0].scheme_id,
    scheme_name: schemes[0].scheme_name,
    steps: []
  }
  if (!schemes[0].step_id) {
    return result
  } else {
    schemes.map(scheme => {
      const step = {
        step_id: scheme.step_id,
        step_number: scheme.step_number,
        instructions: scheme.instructions
      }    
      result.steps.push(step)
    })
    return result
  }

  
}

async function findSteps(scheme_id) { // EXERCISE C


  const steps = await db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
  .where('st.scheme_id', scheme_id)
  .select('st.*', 'sc.scheme_name')
  .orderBy('st.step_number')

  

  return steps
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) { // EXERCISE D
  return await db('schemes').insert(scheme)
  .then(([scheme_id]) => {
    return db('schemes').where('scheme_id', scheme_id).first()
  })
  


  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

async function addStep(scheme_id, step) { // EXERCISE E
  return await db('steps').insert({...step, scheme_id})
  .then(() => {
    return db('steps').where('scheme_id', scheme_id).orderBy('step_number')
  })
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
