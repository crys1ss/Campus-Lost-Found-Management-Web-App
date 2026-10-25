import json, os, uuid

def uid():
    return str(uuid.uuid4()).replace("-", "")[:24]

project_id = uid()
model_id = uid()
uc_view_id = uid()
class_view_id = uid()

mdj = {
    "_type": "Project",
    "_id": project_id,
    "name": "Campus Lost and Found Management System - NMIMS MPSTME",
    "ownedElements": [
        {
            "_type": "UMLModel",
            "_id": model_id,
            "_parent": {"$ref": project_id},
            "name": "Software Engineering Lab Model (Experiments 1-7)",
            "ownedElements": [
                {
                    "_type": "UMLUseCaseDiagram",
                    "_id": uc_view_id,
                    "_parent": {"$ref": model_id},
                    "name": "Exp 3 - Use Case Diagram",
                    "ownedViews": []
                },
                {
                    "_type": "UMLClassDiagram",
                    "_id": class_view_id,
                    "_parent": {"$ref": model_id},
                    "name": "Exp 5 - Class Diagram",
                    "ownedViews": []
                },
                {
                    "_type": "UMLActor",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Campus User"
                },
                {
                    "_type": "UMLActor",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Security Personnel"
                },
                {
                    "_type": "UMLActor",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Administrator"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Report Lost Item"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Report Found Item"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Search & Filter Items"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Match Lost & Found Items"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Submit Ownership Claim"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Verify Claim & Custody"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Process Handover & Return Record"
                },
                {
                    "_type": "UMLUseCase",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Manage Users & Categories"
                },
                {
                    "_type": "UMLClass",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "User",
                    "isAbstract": True,
                    "attributes": [
                        {"_type": "UMLAttribute", "_id": uid(), "name": "userId", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "name", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "email", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "role", "type": "RoleEnum"}
                    ],
                    "operations": [
                        {"_type": "UMLOperation", "_id": uid(), "name": "login"},
                        {"_type": "UMLOperation", "_id": uid(), "name": "logout"}
                    ]
                },
                {
                    "_type": "UMLClass",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "LostItem",
                    "attributes": [
                        {"_type": "UMLAttribute", "_id": uid(), "name": "id", "type": "Integer"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "title", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "category", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "location", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "status", "type": "String"}
                    ]
                },
                {
                    "_type": "UMLClass",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "FoundItem",
                    "attributes": [
                        {"_type": "UMLAttribute", "_id": uid(), "name": "id", "type": "Integer"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "title", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "category", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "storageLocation", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "status", "type": "String"}
                    ]
                },
                {
                    "_type": "UMLClass",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "Claim",
                    "attributes": [
                        {"_type": "UMLAttribute", "_id": uid(), "name": "claimId", "type": "Integer"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "proofDescription", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "status", "type": "ClaimStatus"}
                    ]
                },
                {
                    "_type": "UMLClass",
                    "_id": uid(),
                    "_parent": {"$ref": model_id},
                    "name": "ReturnRecord",
                    "attributes": [
                        {"_type": "UMLAttribute", "_id": uid(), "name": "recordId", "type": "Integer"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "receiptNo", "type": "String"},
                        {"_type": "UMLAttribute", "_id": uid(), "name": "returnDate", "type": "Date"}
                    ]
                }
            ]
        }
    ]
}

os.makedirs("docs/staruml", exist_ok=True)
with open("docs/staruml/CampusLostAndFound.mdj", "w", encoding="utf-8") as f:
    json.dump(mdj, f, indent=2)

print("Generated docs/staruml/CampusLostAndFound.mdj successfully!")
