import pandas as pd

class PersonalizedExercisePlanGenerator:
    def __init__(self, combined_exercises_df, user_exercise_df):
        """
        Initialize the exercise plan generator with combined dataset

        Parameters:
        -----------
        combined_exercises_df : DataFrame
            Combined dataset containing all exercise types (resistance, cardio, flexibility)
        user_exercise_df : DataFrame
            Dataset containing user exercise records
        """
        self.exercises_data = combined_exercises_df
        self.user_exercise_data = user_exercise_df

        # Preprocess datasets
        self._preprocess_datasets()

        # Log initialization details
        exercise_types = self.exercises_data['Exercise_Type'].value_counts()
        print(f"Initialized PersonalizedExercisePlanGenerator with:")
        for ex_type, count in exercise_types.items():
            print(f"- {count} {ex_type} exercises")
        print(f"- {len(self.user_exercise_data)} user exercise records")

    def _preprocess_datasets(self):
        """Preprocess all datasets for analysis"""
        

        # Process exercise dataset
        # Convert string muscle lists to actual lists if they're strings
        for col in ['Target_Muscles', 'Synergist_Muscles', 'Stabilizer_Muscles', 'Secondary Muscles']:
            if col in self.exercises_data.columns:
                # Check if any value is a string before processing
                if self.exercises_data[col].apply(lambda x: isinstance(x, str)).any():
                    self.exercises_data[col] = self.exercises_data[col].apply(
                        lambda x: x.split(',') if isinstance(x, str) else x
                    )

        # Process user exercise data
        # Ensure numeric columns are numeric
        numeric_cols = ['Age', 'Height', 'Weight', 'Duration', 'Heart_Rate', 'Calories']
        for col in numeric_cols:
            if col in self.user_exercise_data.columns:
                self.user_exercise_data[col] = pd.to_numeric(self.user_exercise_data[col], errors='coerce')

        # Calculate BMI and add it as a feature
        if 'Height' in self.user_exercise_data.columns and 'Weight' in self.user_exercise_data.columns:
            self.user_exercise_data['BMI'] = self.user_exercise_data['Weight'] / (
                (self.user_exercise_data['Height'] / 100) ** 2
            )

        print("Datasets preprocessed successfully")

    def _select_stretches_for_muscles(self, muscle_groups):
        """Select appropriate stretches for the given muscle groups"""
        import random
        stretches = []

        # Filter to only flexibility exercises
        stretch_exercises = self.exercises_data[self.exercises_data['Exercise_Type'] == 'Flexibility']

        for muscle in muscle_groups:
            # Find stretches targeting this muscle
            muscle_stretches = stretch_exercises[
                stretch_exercises['Main_muscle'] == muscle
            ]

            if len(muscle_stretches) == 0:
                continue

            # Select one stretch per muscle group
            selected_stretch = muscle_stretches.sample(1).iloc[0]

            stretches.append({
                "name": selected_stretch['Exercise Name'],
                "duration": "30 seconds",
                "target_muscles": selected_stretch['Target_Muscles'],
                "equipment": selected_stretch['Equipment'] if 'Equipment' in selected_stretch else "None",
                "execution": selected_stretch['Execution'] if 'Execution' in selected_stretch else ""
            })

        return stretches

    def _calculate_exercise_duration(self, exercise_type, fitness_level):
        """Calculate appropriate duration for each exercise based on type and fitness level"""
        if exercise_type == 'Cardio':
            if fitness_level == 'beginner':
                return {'min': 10, 'max': 15, 'unit': 'minutes'}
            elif fitness_level == 'intermediate':
                return {'min': 15, 'max': 30, 'unit': 'minutes'}
            else:  # advanced
                return {'min': 20, 'max': 45, 'unit': 'minutes'}

        elif exercise_type == 'Flexibility':
            if fitness_level == 'beginner':
                return {'min': 20, 'max': 30, 'unit': 'seconds per set'}
            elif fitness_level == 'intermediate':
                return {'min': 30, 'max': 45, 'unit': 'seconds per set'}
            else:  # advanced
                return {'min': 45, 'max': 60, 'unit': 'seconds per set'}

        else:  # Resistance
            if fitness_level == 'beginner':
                return {'sets': 2, 'reps': '10-12', 'rest': '60 seconds'}
            elif fitness_level == 'intermediate':
                return {'sets': 3, 'reps': '8-10', 'rest': '45 seconds'}
            else:  # advanced
                return {'sets': 4, 'reps': '6-8', 'rest': '30-45 seconds'}

    def _create_workout_session(self, filtered_exercises, muscle_groups,
                          session_name, exercises_per_group=1, fitness_level='beginner',
                          day_of_week=None, exercise_distribution=None):
        """Create a balanced workout session with exercises and stretches"""
        import random
        exercises = []

        # Default distribution if none provided
        if exercise_distribution is None:
            exercise_distribution = {
                'Resistance': 0.4,
                'Cardio': 0.4,
                'Flexibility': 0.2
            }

        # Calculate how many exercises of each type to include
        total_exercises_target = len(muscle_groups) * exercises_per_group
        exercise_counts = {}
        for ex_type, ratio in exercise_distribution.items():
            exercise_counts[ex_type] = max(1, round(total_exercises_target * ratio))

        # Ensure we have at least one of each exercise type if possible
        for ex_type in ['Resistance', 'Cardio', 'Flexibility']:
            if ex_type not in exercise_counts:
                exercise_counts[ex_type] = 0

        # Balance by muscle group first, then by exercise type
        for muscle in muscle_groups:
            # Get exercises for this muscle group
            muscle_exercises = filtered_exercises[
                filtered_exercises['Main_muscle'] == muscle
            ]

            if len(muscle_exercises) == 0:
                continue

            # Try to get some of each type for this muscle group
            for ex_type in ['Resistance', 'Cardio', 'Flexibility']:
                # Skip if we've already met our quota for this type
                if exercise_counts[ex_type] <= 0:
                    continue

                # Find exercises of this type for this muscle
                type_exercises = muscle_exercises[
                    muscle_exercises['Exercise_Type'] == ex_type
                ]

                if len(type_exercises) == 0:
                    continue

                # Select exercises of this type
                selected = min(exercise_counts[ex_type], len(type_exercises))
                selected_exercises = type_exercises.sample(selected)

                for _, exercise in selected_exercises.iterrows():
                    # Get exercise duration based on type and fitness level
                    duration = self._calculate_exercise_duration(ex_type, fitness_level)

                    # Add exercise to the session
                    exercises.append({
                        "name": exercise['Exercise Name'],
                        "duration": duration,
                        "target_muscles": exercise['Target_Muscles'],
                        "equipment": exercise['Equipment'],
                        "difficulty": exercise['Difficulty (1-5)'],
                        "preparation": exercise['Preparation'] if 'Preparation' in exercise else "",
                        "execution": exercise['Execution'] if 'Execution' in exercise else "",
                        "exercise_type": ex_type,
                        "sets": duration.get('sets', 1),
                        "reps": duration.get('reps', "")
                    })

                    # Decrement our counter for this type
                    exercise_counts[ex_type] -= 1

        # Add appropriate stretches for worked muscles
        stretches = self._select_stretches_for_muscles(muscle_groups)

        # Calculate total estimated duration
        total_duration = self._calculate_session_duration(exercises, stretches)

        return {
            "name": session_name,
            "day_of_week": day_of_week,
            "exercises": exercises,
            "stretches": stretches,
            "estimated_duration": total_duration
        }

    def _calculate_session_duration(self, exercises, stretches):
        """Calculate the estimated duration of the workout session"""
        total_minutes = 0

        # Add exercise durations
        for exercise in exercises:
            if exercise['exercise_type'] == 'Cardio':
                # Use the midpoint of the min-max range if available
                if 'duration' in exercise and isinstance(exercise['duration'], dict):
                    dur = exercise['duration']
                    if 'min' in dur and 'max' in dur:
                        total_minutes += (dur['min'] + dur['max']) / 2
                    elif 'min' in dur:
                        total_minutes += dur['min']
                    else:
                        total_minutes += 10  # Default cardio time
                else:
                    total_minutes += 10  # Default if duration not specified

            elif exercise['exercise_type'] == 'Resistance':
                # Estimate based on sets, reps and rest time
                if 'sets' in exercise:
                    sets = exercise['sets']
                    # Average time per set (including rest)
                    avg_time_per_set = 1.5  # ~1.5 minutes per set including rest
                    total_minutes += sets * avg_time_per_set
                else:
                    total_minutes += 5  # Default if sets not specified

            elif exercise['exercise_type'] == 'Flexibility':
                # Convert seconds to minutes and multiply by sets
                if 'duration' in exercise and isinstance(exercise['duration'], dict):
                    dur = exercise['duration']
                    if 'min' in dur and 'max' in dur:
                        seconds_per_set = (dur['min'] + dur['max']) / 2
                    elif 'min' in dur:
                        seconds_per_set = dur['min']
                    else:
                        seconds_per_set = 30  # Default
                else:
                    seconds_per_set = 30  # Default

                # Usually 2-3 sets for flexibility exercises
                sets = 2.5  # Average between 2-3 sets
                total_minutes += (seconds_per_set * sets) / 60

        # Add stretch durations (typically in seconds)
        for stretch in stretches:
            # Convert to minutes (assuming 30 seconds per stretch by default)
            duration_str = stretch.get('duration', '30 seconds')
            seconds = 30  # Default

            # Extract number from string like "30 seconds"
            import re
            match = re.search(r'(\d+)', duration_str)
            if match:
                seconds = int(match.group(1))

            # Assume 2 sets per stretch
            total_minutes += (seconds * 2) / 60

        # Add warm-up and cool-down times
        warm_up = 5  # 5 minutes for warm-up
        cool_down = 5  # 5 minutes for cool-down

        return total_minutes + warm_up + cool_down

    def _create_weekly_schedule(self, filtered_exercises, sessions_per_week, fitness_level,
                          fitness_goal, distribution, available_days=None):
        """Create a full weekly schedule with exercises assigned to specific days"""
        import random

        # Default to all days if not specified
        all_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        if available_days is None or len(available_days) < sessions_per_week:
            available_days = all_days

        # Randomly select days if more available than needed
        if len(available_days) > sessions_per_week:
            workout_days = random.sample(available_days, sessions_per_week)
        else:
            workout_days = available_days[:sessions_per_week]

        # Sort days to maintain weekly order
        day_order = {day: i for i, day in enumerate(all_days)}
        workout_days.sort(key=lambda x: day_order.get(x, 7))  # Sort by day order

        main_muscle_groups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
        workout_sessions = []

        # Create different workout sessions based on sessions_per_week
        if sessions_per_week <= 3:
            # Full body workouts
            for i, day in enumerate(workout_days):
                session = self._create_workout_session(
                    filtered_exercises,
                    main_muscle_groups,
                    session_name=f"Full Body Workout",
                    exercises_per_group=1,
                    fitness_level=fitness_level,
                    day_of_week=day,
                    exercise_distribution=distribution
                )
                workout_sessions.append(session)
        else:
            # Split routines
            if sessions_per_week == 4:
                # Upper/Lower split
                splits = [
                    {'name': 'Upper Body', 'muscles': ['Chest', 'Back', 'Shoulders', 'Arms']},
                    {'name': 'Lower Body', 'muscles': ['Legs', 'Core']},
                    {'name': 'Upper Body', 'muscles': ['Chest', 'Back', 'Shoulders', 'Arms']},
                    {'name': 'Lower Body', 'muscles': ['Legs', 'Core']}
                ]
            else:  # 5 or more sessions
                # Push/Pull/Legs split
                splits = [
                    {'name': 'Push Day (Chest & Shoulders)', 'muscles': ['Chest', 'Shoulders', 'Arms']},
                    {'name': 'Pull Day (Back & Arms)', 'muscles': ['Back', 'Arms']},
                    {'name': 'Legs Day', 'muscles': ['Legs']},
                    {'name': 'Push Day (Chest & Shoulders)', 'muscles': ['Chest', 'Shoulders', 'Arms']},
                    {'name': 'Pull Day (Back & Arms)', 'muscles': ['Back', 'Arms']},
                    {'name': 'Legs & Core Day', 'muscles': ['Legs', 'Core']}
                ]
                splits = splits[:sessions_per_week]  # Limit to requested number of sessions

            for i, (split, day) in enumerate(zip(splits, workout_days)):
                session = self._create_workout_session(
                    filtered_exercises,
                    split['muscles'],
                    session_name=split['name'],
                    exercises_per_group=2,
                    fitness_level=fitness_level,
                    day_of_week=day,
                    exercise_distribution=distribution
                )
                workout_sessions.append(session)

        # Add recovery/active rest days
        rest_days = [day for day in all_days if day not in workout_days]

        return {
            "workout_sessions": workout_sessions,
            "rest_days": rest_days
        }

    def generate_exercise_plan(self, user_id=None, fitness_goal=None,
                         fitness_level=None, session_duration=45, sessions_per_week=3,
                         user_profile=None, available_days=None):
        """
        Generate a personalized exercise plan for a user

        Parameters:
        -----------
        user_id: str, optional
            ID of the user to generate plan for. If provided, we'll use data from the dataset.

        user_profile: dict, optional
            Manually provided user profile if user_id is not in dataset

        fitness_goal: str, optional
            User's fitness goal (e.g., 'strength', 'endurance', 'weight_loss')
            If None, will be determined from the user's BMI.

        fitness_level: str, optional
            User's fitness level ('beginner', 'intermediate', 'advanced')

        session_duration: int, optional
            Target duration for each session in minutes

        sessions_per_week: int, optional
            Number of sessions per week

        available_days: list, optional
            List of days when the user is available to exercise

        Returns:
        --------
        dict: Personalized exercise plan
        """

        print(f"\nGenerating personalized exercise plan...")

        # 1. Process user profile
        if user_id is not None and user_profile is None:
            # Try to find user in the dataset
            user_data = self.user_exercise_data[self.user_exercise_data['User_ID'] == user_id]
            if len(user_data) > 0:
                # Use the most recent record if multiple exist
                latest_user_data = user_data.iloc[-1]
                user_profile = {
                    'User_ID': user_id,
                    'age': latest_user_data.get('Age'),
                    'bmi': latest_user_data.get('BMI'),
                    'weight': latest_user_data.get('Weight'),
                    'height': latest_user_data.get('Height')
                }
                print(f"Using profile data for user {user_id}")

        # 2. Determine fitness goal if not provided
        if fitness_goal is None and user_profile is not None and 'bmi' in user_profile:
            bmi = user_profile['bmi']
            if bmi <= 25:
                fitness_goal = 'strength'
            elif bmi > 25:
                fitness_goal = 'endurance'
            if bmi > 30:
                fitness_goal = 'weight_loss'
            print(f"Determined fitness goal from BMI: {fitness_goal}")
        elif fitness_goal is None:
            # Default to general fitness if can't determine from BMI
            fitness_goal = 'general_fitness'
            print(f"Using default fitness goal: {fitness_goal}")

        # 3. Use provided fitness level or set default
        if fitness_level is None:
            # Default to beginner if no fitness level provided
            fitness_level = 'beginner'
        else:
            # Standardize the fitness level string
            fitness_level = str(fitness_level).lower()

        # Ensure fitness_level is one of our recognized levels
        if fitness_level not in ['beginner', 'intermediate', 'advanced']:
            # Map other common terms
            if fitness_level in ['beginner', 'novice', 'new']:
                fitness_level = 'beginner'
            elif fitness_level in ['intermediate', 'medium', 'moderate']:
                fitness_level = 'intermediate'
            elif fitness_level in ['advanced', 'expert', 'athletic']:
                fitness_level = 'advanced'
            else:
                # Default to beginner
                fitness_level = 'beginner'

        print(f"Using fitness level: {fitness_level}")

        # 4. Select appropriate difficulty based on fitness level
        if fitness_level == 'beginner':
            difficulty_range = [1, 2, 3]
        elif fitness_level == 'intermediate':
            difficulty_range = [2, 3, 4]
        else:  # advanced
            fitness_level = 'advanced'  # Standardize
            difficulty_range = [3, 4, 5]

        filtered_exercises = self.exercises_data[
            self.exercises_data['Difficulty (1-5)'].isin(difficulty_range)
        ]

        print(f"Filtered to {len(filtered_exercises)} exercises based on difficulty ({difficulty_range})")

        # 5. Define exercise distribution based on fitness goal
        # Use standard health guidelines - 150 minutes per week
        base_minutes = 150

        # Set distribution based on fitness goal
        if fitness_goal == 'strength':
            distribution = {
                'Resistance': 0.6,   # 60% strength training
                'Cardio': 0.3,       # 30% cardio
                'Flexibility': 0.1   # 10% flexibility/mobility
            }
        elif fitness_goal == 'endurance':
            distribution = {
                'Resistance': 0.3,   # 30% strength training
                'Cardio': 0.6,       # 60% cardio
                'Flexibility': 0.1   # 10% flexibility/mobility
            }
        elif fitness_goal == 'weight_loss':
            distribution = {
                'Resistance': 0.4,   # 40% strength training
                'Cardio': 0.5,       # 50% cardio
                'Flexibility': 0.1   # 10% flexibility/mobility
            }
        elif fitness_goal == 'flexibility':
            distribution = {
                'Resistance': 0.2,   # 20% strength training
                'Cardio': 0.2,       # 20% cardio
                'Flexibility': 0.6   # 60% flexibility/mobility
            }
        else:  # General fitness
            fitness_goal = 'general_fitness'  # Standardize
            distribution = {
                'Resistance': 0.4,   # 40% strength training
                'Cardio': 0.4,       # 40% cardio
                'Flexibility': 0.2   # 20% flexibility/mobility
            }

        print(f"Health guidelines: {base_minutes:.0f} minutes/week recommended")
        print(f"Exercise distribution: {distribution}")

        # 6. Create weekly schedule with exercises assigned to specific days
        weekly_schedule = self._create_weekly_schedule(
            filtered_exercises,
            sessions_per_week,
            fitness_level,
            fitness_goal,
            distribution,
            available_days
        )

        print(f"Created weekly schedule with {len(weekly_schedule['workout_sessions'])} workout sessions")

        # 7. Calculate total weekly duration and verify it meets guidelines
        total_weekly_minutes = sum(session['estimated_duration'] for session in weekly_schedule['workout_sessions'])
        print(f"Total weekly exercise: {total_weekly_minutes:.0f} minutes")

        if total_weekly_minutes < base_minutes:
            print(f"Warning: Plan provides {total_weekly_minutes:.0f} minutes which is below the recommended {base_minutes:.0f} minutes.")

        # 8. Add general notes about the workout plan
        for session in weekly_schedule['workout_sessions']:
            # Add note about this personalization
            session["personalization_notes"] = [
                f"This workout focuses on {fitness_goal.replace('_', ' ')} training",
                f"Follows health guidelines of {base_minutes} minutes per week",
                f"Adapted for {fitness_level} fitness level"
            ]

        # 9. Build final plan with additional metadata
        user_id_value = user_id or "user_default"
        if user_profile:
            user_id_value = user_profile.get('User_ID', user_id_value)

        plan = {
            "user_id": user_id_value,
            "fitness_level": fitness_level,
            "fitness_goal": fitness_goal,
            "recommended_frequency": f"{sessions_per_week} times per week",
            "recommended_duration": f"{session_duration} minutes per session",
            "weekly_recommended_minutes": base_minutes,
            "weekly_plan_minutes": total_weekly_minutes,
            "workout_sessions": weekly_schedule["workout_sessions"],
            "rest_days": weekly_schedule["rest_days"]
        }

        print("Exercise plan generation complete!")
        return plan

    def format_plan_for_display(self, plan):
        """
        Format the exercise plan for clear display

        Parameters:
        -----------
        plan: dict
            The exercise plan generated by generate_exercise_plan

        Returns:
        --------
        dict: Formatted plan for display
        """
        formatted_plan = {
            "user_id": plan["user_id"],
            "fitness_level": plan["fitness_level"],
            "fitness_goal": plan["fitness_goal"],
            "recommended_frequency": plan["recommended_frequency"],
            "recommended_duration": plan["recommended_duration"],
            "weekly_schedule": {}
        }

        # Format each day's workout
        days_with_workouts = []
        for session in plan["workout_sessions"]:
            day = session["day_of_week"]
            days_with_workouts.append(day)

            # Format exercises for display
            formatted_exercises = []
            for exercise in session["exercises"]:
                exercise_type = exercise.get("exercise_type", "Resistance")

                formatted_ex = {
                    "name": exercise["name"],
                    "type": exercise_type,
                    "target_muscles": exercise["target_muscles"],
                    "equipment": exercise["equipment"],
                    "instructions": exercise.get("execution", "")
                }

                # Format duration based on type
                if exercise_type == "Cardio":
                    if "duration" in exercise and isinstance(exercise["duration"], dict):
                        dur = exercise["duration"]
                        formatted_ex["duration"] = f"{dur.get('min', '10')}-{dur.get('max', '15')} {dur.get('unit', 'minutes')}"
                    else:
                        formatted_ex["duration"] = "10-15 minutes"
                elif exercise_type == "Flexibility":
                    if "duration" in exercise and isinstance(exercise["duration"], dict):
                        dur = exercise["duration"]
                        formatted_ex["duration"] = f"{dur.get('min', '30')}-{dur.get('max', '45')} {dur.get('unit', 'seconds')}"
                    else:
                        formatted_ex["duration"] = "30-45 seconds"
                else:  # Resistance
                    if "duration" in exercise and isinstance(exercise["duration"], dict):
                        dur = exercise["duration"]
                        formatted_ex["sets"] = dur.get("sets", 3)
                        formatted_ex["reps"] = dur.get("reps", "10-12")
                        formatted_ex["rest"] = dur.get("rest", "60 seconds")
                    else:
                        # Fall back to direct values if present
                        formatted_ex["sets"] = exercise.get("sets", 3)
                        formatted_ex["reps"] = exercise.get("reps", "10-12")
                        formatted_ex["rest"] = "60 seconds"

                formatted_exercises.append(formatted_ex)

            # Format stretches
            formatted_stretches = []
            for stretch in session["stretches"]:
                formatted_stretches.append({
                    "name": stretch["name"],
                    "duration": stretch["duration"],
                    "target_muscles": stretch["target_muscles"],
                    "instructions": stretch.get("execution", "")
                })

            # Add to schedule
            formatted_plan["weekly_schedule"][day] = {
                "workout_name": session["name"],
                "estimated_duration": f"{session['estimated_duration']:.0f} minutes",
                "exercises": formatted_exercises,
                "stretches": formatted_stretches,
                "notes": session.get("personalization_notes", [])
            }

        # Add rest days
        for day in plan["rest_days"]:
            formatted_plan["weekly_schedule"][day] = {
                "workout_name": "Rest Day",
                "notes": ["Active recovery day - light walking or stretching recommended"]
            }

        return formatted_plan

    def display_plan(self, plan):
        formatted_plan = self.format_plan_for_display(plan)

        # Display the plan
        print("\n" + "="*50)
        print(f"PERSONALIZED EXERCISE PLAN FOR USER {plan['user_id']}")
        print("="*50)

        print(f"Fitness Level: {plan['fitness_level']}")
        print(f"Fitness Goal: {plan['fitness_goal']} (Determined from user data)")
        print(f"Recommended Frequency: {plan['recommended_frequency']}")
        print(f"Weekly Recommendation: {plan['weekly_recommended_minutes']:.0f} minutes")
        print(f"Plan Provides: {plan['weekly_plan_minutes']:.0f} minutes")

        print("\nWEEKLY SCHEDULE:")

        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        for day in days_order:
            if day in formatted_plan['weekly_schedule']:
                day_plan = formatted_plan['weekly_schedule'][day]
                print(f"\n{day}: {day_plan['workout_name']}")
                print("-" * 30)

                if 'exercises' in day_plan:
                    # Calculate the total time for this day's workout
                    day_total_minutes = 0
                    if 'estimated_duration' in day_plan:
                        day_total_minutes = day_plan['estimated_duration'].replace(' minutes', '')
                        try:
                            day_total_minutes = float(day_total_minutes)
                        except:
                            day_total_minutes = 0

                    print(f"Total workout time: {day_total_minutes:.0f} minutes")
                    print("\nExercises:")

                    # Track exercise time
                    exercise_times = []

                    for j, exercise in enumerate(day_plan['exercises']):
                        print(f"  {j+1}. {exercise['name']} - {exercise['type']}")

                        # Calculate and display time for this exercise
                        exercise_time = 0

                        # Display different info based on exercise type
                        if exercise['type'] == 'Resistance':
                            sets = exercise.get('sets', 3)
                            # Estimate ~1.5 minutes per set (including rest)
                            exercise_time = sets * 1.5
                            print(f"     Sets: {exercise['sets']}, Reps: {exercise['reps']}, Rest: {exercise['rest']}")
                            print(f"     Estimated time: {exercise_time:.1f} minutes")
                        else:
                            # Extract duration from string like "10-15 minutes"
                            if 'duration' in exercise:
                                dur_parts = exercise['duration'].split('-')
                                if len(dur_parts) == 2 and 'minute' in exercise['duration']:
                                    try:
                                        min_time = float(dur_parts[0])
                                        max_time = float(dur_parts[1].split()[0])
                                        exercise_time = (min_time + max_time) / 2
                                    except:
                                        exercise_time = 5  # Default

                            print(f"     Duration: {exercise['duration']}")
                            print(f"     Estimated time: {exercise_time:.1f} minutes")

                        exercise_times.append(exercise_time)
                        print(f"     Target muscles: {exercise['target_muscles']}")
                        print(f"     Equipment: {exercise['equipment']}")

                        # Include execution instructions if available
                        if 'instructions' in exercise and exercise['instructions']:
                            print(f"     Instructions: {exercise['instructions'][:100]}..."
                                if len(exercise['instructions']) > 100
                                else f"     Instructions: {exercise['instructions']}")

                    # Calculate total exercise time
                    total_exercise_time = sum(exercise_times)
                    print(f"\nTotal exercise time: {total_exercise_time:.1f} minutes")

                    # Add time for stretches, warm-up, cool-down
                    stretch_time = 0
                    if 'stretches' in day_plan and day_plan['stretches']:
                        print("\n  Stretches:")
                        stretch_time = len(day_plan['stretches']) * 1  # ~1 minute per stretch

                        for j, stretch in enumerate(day_plan['stretches']):
                            print(f"  {j+1}. {stretch['name']} - {stretch['duration']}")
                            print(f"     Target muscles: {stretch['target_muscles']}")

                        print(f"\n  Total stretch time: {stretch_time:.1f} minutes")

                    # Add warm-up and cool-down
                    warm_up = 5
                    cool_down = 5
                    print(f"\n  Warm-up: {warm_up} minutes")
                    print(f"  Cool-down: {cool_down} minutes")

                    # Show final breakdown
                    print(f"\n  Time breakdown:")
                    print(f"  - Warm-up: {warm_up} minutes")
                    print(f"  - Exercises: {total_exercise_time:.1f} minutes")
                    if stretch_time > 0:
                        print(f"  - Stretches: {stretch_time:.1f} minutes")
                    print(f"  - Cool-down: {cool_down} minutes")
                    print(f"  = Total: {warm_up + total_exercise_time + stretch_time + cool_down:.1f} minutes")

                if 'notes' in day_plan and day_plan['notes']:
                    print("\n  Notes:")
                    for note in day_plan['notes']:
                        print(f"  • {note}")
