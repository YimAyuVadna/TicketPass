"""
TicketPass — Machine Learning Implementation

# Point 3: ML #1 — Decision Tree Ticket Type Classifier
# Point 3.1: Purpose
The purpose of ML #1 is to predict the ticket type:
  - DIGITAL (0)
  - PHYSICAL (1)
The model learns patterns from previous ticket/order data and uses those
patterns to classify new ticket/order transactions.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

# Resolve paths relative to script location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "ticket_classifier.pkl")

# Point 3.1 & Point 5: Binary Classification Task
# Classification means predicting a discrete category/class rather than a continuous number (e.g. not $15.72).
# Because there are exactly two target classes, this is a Binary Classification problem:
#   - Class 0: DIGITAL
#   - Class 1: PHYSICAL
LABEL_MAP = {
    0: "DIGITAL",
    1: "PHYSICAL"
}


def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    if "label" not in df.columns:
        raise ValueError("Expected a 'label' column in training_data.csv")
    return df


def train_and_evaluate(df: pd.DataFrame):
    # Point 4: Supervised Learning — Separate Features (X) and Ground-Truth Labels (y)
    # Supervised learning means the training data contains the correct answers ('label').
    # The Decision Tree learns to map: Features (X) -> Ticket Type Label (y).
    feature_cols = [c for c in df.columns if c != "label"]
    X = df[feature_cols]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Point 3: Initialize the Decision Tree Classifier
    model = DecisionTreeClassifier(
        max_depth=6,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    print("=" * 55)
    print(" Member 2: Model Training & Evaluation")
    print("=" * 55)
    print(f" Train rows: {len(X_train)}   Test rows: {len(X_test)}")
    print(f" Accuracy:   {accuracy_score(y_test, y_pred):.4f}")
    print("\n Classification report:")
    print(classification_report(y_test, y_pred, target_names=["DIGITAL", "PHYSICAL"]))
    print(" Confusion matrix (rows=actual, cols=predicted):")
    print(confusion_matrix(y_test, y_pred))

    print("\n Feature importances:")
    importances = sorted(
        zip(feature_cols, model.feature_importances_),
        key=lambda x: x[1],
        reverse=True,
    )
    for name, score in importances:
        print(f"   {name:<28} {score:.4f}")

    return model, feature_cols


def save_model(model, feature_cols, path: str):
    payload = {
        "model": model,
        "feature_columns": feature_cols,
        "label_map": LABEL_MAP,
    }
    joblib.dump(payload, path)
    print(f"\n Model saved to: {path}")


if __name__ == "__main__":
    df = load_data(DATA_PATH)
    model, feature_cols = train_and_evaluate(df)
    save_model(model, feature_cols, MODEL_PATH)
