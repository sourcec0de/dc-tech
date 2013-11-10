var VIAB = {
    "OrderProductResponse": {
        "@ServiceVersionNumber": "3.0",
        "TransactionDetail": {
            "ApplicationTransactionID": "automation",
            "ServiceTransactionID": "Id-616ca778527f9ed13d5b1b3f-2",
            "TransactionTimestamp": "2013-11-10T09:57:22.195-05:00"
        },
        "TransactionResult": {
            "SeverityText": "Information",
            "ResultID": "CM000",
            "ResultText": "Success"
        },
        "OrderProductResponseDetail": {
            "InquiryDetail": {
                "DUNSNumber": "969637904",
                "CountryISOAlpha2Code": "US"
            },
            "Product": {
                "DNBProductID": "VIAB_RAT",
                "Organization": {
                    "SubjectHeader": {
                        "DUNSNumber": "969637904"
                    },
                    "Telecommunication": {
                        "TelephoneNumber": [
                            {
                                "TelecommunicationNumber": "(888) 649-2252",
                                "InternationalDialingCode": "1"
                            }
                        ]
                    },
                    "Location": {
                        "PrimaryAddress": [
                            {
                                "StreetAddressLine": [
                                    {
                                        "LineText": "767 3rd Ave FL 16"
                                    }
                                ],
                                "PrimaryTownName": "New York",
                                "CountryISOAlpha2Code": "US",
                                "TerritoryAbbreviatedName": "NY",
                                "PostalCode": "10017",
                                "TerritoryOfficialName": "New York"
                            }
                        ]
                    },
                    "OrganizationName": {
                        "OrganizationPrimaryName": [
                            {
                                "OrganizationName": {
                                    "$": "Nutritionix LLC"
                                }
                            }
                        ]
                    },
                    "OrganizationDetail": {
                        "StandaloneOrganizationIndicator": true
                    },
                    "Assessment": {
                        "DNBViabilityRating": {
                            "DNBViabilityRating": "68ER",
                            "ViabilityScore": {
                                "ClassScore": 6,
                                "RiskLevelDescription": {
                                    "@DNBCodeValue": 13695,
                                    "$": "Moderate"
                                },
                                "BadRate": 13,
                                "ClassScoreIncidencePercentage": 30,
                                "OverallBadRate": 14
                            },
                            "PortfolioComparisonScore": {
                                "ClassScore": 8,
                                "RiskLevelDescription": {
                                    "@DNBCodeValue": 13702,
                                    "$": "High"
                                },
                                "BadRate": 17,
                                "ClassScoreIncidencePercentage": 15,
                                "ModelSegmentDescription": {
                                    "@DNBCodeValue": 26236,
                                    "$": "Limited Trade Payments"
                                },
                                "SegmentBadRate": 11
                            },
                            "DataDepthDetail": {
                                "DataDepthIndicator": "E",
                                "AssessmentText": [
                                    "Rich Firmographics",
                                    "Sparse Commercial Trading Activity",
                                    "No Financial Attributes"
                                ]
                            },
                            "OrganizationProfileDetail": {
                                "OrganizationProfileRating": "R",
                                "FinancialDataAvailableIndicator": false,
                                "TradeDataAvailabilityDetail": {
                                    "TradeDataAvailableIndicator": true,
                                    "AssessmentText": [
                                        "Available: 1-2 Trade"
                                    ]
                                },
                                "OrganizationSizeDetail": {
                                    "OrganizationSizeCategoryText": "Small",
                                    "AssessmentText": [
                                        "Small: Employees: &lt;10 or Sales: &lt;$10K or Missing"
                                    ]
                                },
                                "YearsInBusinessDetail": {
                                    "YearsInBusinessCategoryText": "Young",
                                    "AssessmentText": [
                                        "Young: &lt;5"
                                    ]
                                }
                            }
                        }
                    }
                },
                "ArchiveDetail": {
                    "PortfolioAssetID": 36265655
                }
            }
        }
    }
}

console.log(VIAB.OrderProductResponse.OrderProductResponseDetail.Product.Organization.Assessment.DNBViabilityRating.DNBViabilityRating)