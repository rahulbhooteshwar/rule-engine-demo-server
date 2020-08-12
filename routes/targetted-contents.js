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
      const ruleQuery = {
        $or: [
          {
            conditionMatchType: 'ANY',
            $or: [
              { countries: user.country },
              { languages: user.lang },
              { markets: user.market },
              { issuerSegmentations: user.issuerSegmentation }
            ]
          },
          {
            conditionMatchType: 'ALL',
            $and: [
              { $or: [{ countries: user.country }, { countries: [] }] },
              { $or: [{ languages: user.lang }, { languages: [] }] },
              { $or: [{ markets: user.market }, { markets: [] }] },
              { $or: [{ issuerSegmentations: user.issuerSegmentation }, { issuerSegmentations: [] }] }
            ]
          }
        ]
      }
      // GET ONLY APPLICABLE RULES
      const rules = await Rule.find(ruleQuery, "_id title conditionMatchType")
      const filteredRuleIds = rules.map(({ _id }) => _id)
      console.log(rules)

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