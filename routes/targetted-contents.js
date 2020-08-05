import express from 'express';
import User from '../models/user';
import Rule from '../models/rule';
import Content from '../models/content'

const router = express.Router();
router.get('/:userId', async ({ params: { userId } }, res, _next) => {
  if (!userId) {
    res.status(400).send(new Error('Please provide user id for targetted content'))
  }
  try {
    // GET THE USER
    const user = await User.findOne({ _id: userId })
    if (user) {
      // GET ALL THE RULES & FILTER OUT ONLY APPLICABLE RULES
      // TODO check if this filtering can be managed using DB query itself
      const rules = await Rule.find({ "conditions.0": { "$exists": true } })
      const filteredRules = rules.filter(rule => {
        // get matched conditions
        const matchedConditions = rule.conditions.filter(condition => {
          switch (condition.attribute) {
            case 'country': {
              return condition.inValues.indexOf(user.country) !== -1
            }
            case 'lang': {
              return condition.inValues.indexOf(user.lang) !== -1
            }
            case 'market': {
              return condition.inValues.indexOf(user.market) !== -1
            }
            case 'issuerSegmentation': {
              return condition.inValues.indexOf(user.issuerSegmentation) !== -1
            }
            default: {
              return false
            }
          }
        });
        // check if this rule is applicable or not
        if (matchedConditions.length > 0) {
          if (rule.conditionMatchType === 'ANY') {
            // if any available conditions matches & rule condition match type is ANY
            return true;
          } else if (rule.conditionMatchType === 'ALL' && matchedConditions.length === rule.conditions.length) {
            // if all available conditions matches & rule condition match type is ALL
            return true;
          } else {
            // flow will reach here in case match Type is ALL, but not all conditions matched
            return false
          }
        } else {
          return false
        }

      })
      const filteredRuleIds = filteredRules.map(({ _id }) => _id)

      // GET THE FILTERED CONTENTS, BASED on RULES
      let contents = await Content.aggregate([
        {
          $project: {
            document: "$$ROOT",
            isSubset: { $setIsSubset: ['$rules', filteredRuleIds] }
          }
        },
        {
          $match: {
            $or: [
              { // contents with empty rules
                'document.rules.0': { $exists: false }
              },
              {  // contents with ruleMatchType ANY & having partial match with user applicable rules
                'document.ruleMatchType': 'ANY', 'document.rules': { $in: filteredRuleIds }
              },
              {  // contents with ruleMatchType ALL & having rule list as a complete subset of user applicable rules
                'document.ruleMatchType': 'ALL', isSubset: true
              }
            ]
          }
        },
        // to project back all fields
        {
          "$replaceRoot": { "newRoot": "$document" }
        }
      ]).sort({ updatedAt: -1 })
      contents = await Content.populate(contents, { path: 'rules', select: '_id, title' })
      res.send(contents)
    } else {
      throw new Error('Please provide valid user id for targetted content')
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: e.message })
  }
})

export default router