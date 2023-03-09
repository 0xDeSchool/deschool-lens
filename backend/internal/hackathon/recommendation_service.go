package hackathon

import (
	"context"
	"github.com/0xdeschool/deschool-lens/backend/pkg/di"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
)

func (hm *HackathonManager) RunRecommendations(ctx context.Context, userId primitive.ObjectID) *UserRecommendation {
	q11eList := hm.q11eRepo.GetAll(ctx)
	var fromQ11e *Q11e
	var recommendation *UserRecommendation
	var highestScore int

	// Find self q11e
	for _, q11e := range q11eList {
		if q11e.UserId == userId {
			fromQ11e = &q11e
			break
		}
	}
	if fromQ11e == nil {
		return nil
		// errx.Panic("address hasn't filled a questionnaire yet, please fill the form first!")
	}

	// Find the pair
	for _, q11e := range q11eList {
		if q11e.UserId == userId {
			continue
		}
		ur := hm.compareTwoId(ctx, *fromQ11e, q11e)
		if ur.Score > highestScore {
			highestScore = ur.Score
			recommendation = ur
		}
	}
	if recommendation == nil {
		//errx.Panic("The application's questionnaire stamps are not enough to give a convincing recommendation, please come back later and thanks for your support!")
		return nil
	}

	repo := *di.Get[UserRecommendationRepository]()
	repo.Insert(ctx, recommendation)
	return recommendation

}

var MBTI_MATCHING_MAP = [16][16]int{
	{8, 8, 8, 10, 8, 10, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2},
	{8, 8, 10, 8, 10, 8, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2},
	{8, 10, 8, 8, 8, 8, 8, 10, 2, 2, 2, 2, 2, 2, 2, 2},
	{10, 8, 8, 8, 8, 8, 8, 8, 10, 2, 2, 2, 2, 2, 2, 2},
	{8, 10, 8, 8, 8, 8, 8, 10, 6, 6, 6, 6, 4, 4, 4, 4},
	{10, 8, 8, 8, 8, 8, 10, 8, 6, 6, 6, 6, 6, 6, 6, 6},
	{8, 8, 8, 8, 8, 10, 8, 8, 6, 6, 6, 6, 4, 4, 4, 10},
	{8, 8, 10, 8, 10, 8, 8, 8, 6, 6, 6, 6, 4, 4, 4, 4},

	{2, 2, 2, 10, 6, 6, 6, 6, 4, 4, 4, 4, 6, 10, 6, 10},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 10, 6, 10, 6},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 6, 10, 6, 10},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 10, 6, 10, 6},

	{2, 2, 2, 2, 4, 6, 4, 4, 6, 10, 6, 10, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 4, 4, 10, 6, 10, 6, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 4, 4, 6, 10, 6, 10, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 10, 4, 10, 6, 10, 6, 8, 8, 8, 8},
}

func (hm *HackathonManager) compareTwoId(ctx context.Context, fromQ11e Q11e, toQ11e Q11e) *UserRecommendation {

	score := 0
	ur := &UserRecommendation{
		UserId:   fromQ11e.UserId,
		TargetId: toQ11e.UserId,
		Reasons:  []string{},
	}

	// Goals match
	score += getSameAndScore(fromQ11e.Goals, toQ11e.Goals, "goal", ur)

	// Fields match
	score += getSameAndScore(fromQ11e.Interests, toQ11e.Interests, "interest", ur)

	// Preferences match
	// fromPrefs := []string{fromQ11e.Pref1, fromQ11e.Pref2, fromQ11e.Pref3}
	// toPrefs := []string{toQ11e.Pref1, toQ11e.Pref2, toQ11e.Pref3}
	// score += getSameAndScore(fromPrefs, toPrefs, "preference", ur)

	// Mbti match
	if 0 <= int(fromQ11e.Mbti) && int(fromQ11e.Mbti) < 16 &&
		0 <= int(toQ11e.Mbti) && int(toQ11e.Mbti) < 16 {

		delta := MBTI_MATCHING_MAP[fromQ11e.Mbti][toQ11e.Mbti]
		score += delta
		var reasonStr string
		if 4 <= score && score <= 8 {
			reasonStr = "Your characters fit each other according to MBTi personality theory."
		} else if 8 < score {
			reasonStr = "Your characters perfectly fit each other according to MBTi personality theory."
		}
		ur.Reasons = append(ur.Reasons, reasonStr)
		ur.Score = score * 2
	}

	return ur
}

func getSameAndScore(fromItems []string, toItems []string, fieldName string, ur *UserRecommendation) int {
	sameItemCnt := 0
	delta := 0
	const PERFECT_MATCH_THRESHOLD = 2
	var sameItemArr []string
	for _, item := range fromItems {
		if linq.Contains(toItems, &item) {
			sameItemCnt += 1
			sameItemArr = append(sameItemArr, item)
		}
	}

	if sameItemCnt > 0 {
		// 加分
		if sameItemCnt > PERFECT_MATCH_THRESHOLD {
			delta += 50
		} else {
			delta += 30
		}
		// 组装原因句子
		reasonStr := ""
		for _, sameItem := range sameItemArr {
			reasonStr = reasonStr + sameItem + ", "
		}
		if len(reasonStr) >= 2 {
			reasonStr = reasonStr[:len(reasonStr)-2]
		}
		containS := ""
		if sameItemCnt > 1 {
			containS = "s"
		}
		// 添加
		ur.Reasons = append(ur.Reasons, "You both have the same "+fieldName+containS+": "+reasonStr+".")
	}
	return delta
}
