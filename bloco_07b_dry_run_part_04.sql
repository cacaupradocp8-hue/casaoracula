-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 4 de 8)
-- Diagnóstico de FKs 151 a 200 (Total: 50)

DO $$
DECLARE
    v_total_analyzed INTEGER := 0;
    v_total_exists INTEGER := 0;
    v_total_ready INTEGER := 0;
    v_total_missing_source_table INTEGER := 0;
    v_total_missing_source_column INTEGER := 0;
    v_total_missing_target_table INTEGER := 0;
    v_total_missing_target_column INTEGER := 0;
    v_total_type_mismatch INTEGER := 0;
    v_total_target_not_unique INTEGER := 0;
    v_total_other INTEGER := 0;
    
    v_source_schema TEXT;
    v_source_table TEXT;
    v_target_schema TEXT;
    v_target_table TEXT;
    
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
    RAISE NOTICE 'Iniciando diagnóstico PARTE 4...';

    -- Analisando course_exercise_responses_lesson_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_exercise_responses') THEN
        RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_exercise_responses';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id') THEN
        RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_exercise_responses.lesson_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: MISSING_TARGET_TABLE | Table: course_lessons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: MISSING_TARGET_COLUMN | Column: course_lessons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_exercise_responses.lesson_id', v_source_type, 'course_lessons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.course_lessons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: TARGET_NOT_UNIQUE | Column: course_lessons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_exercise_responses_lesson_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_lesson_progress_lesson_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lesson_progress') THEN
        RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_lesson_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id') THEN
        RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_lesson_progress.lesson_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: MISSING_TARGET_TABLE | Table: course_lessons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: MISSING_TARGET_COLUMN | Column: course_lessons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_lesson_progress.lesson_id', v_source_type, 'course_lessons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.course_lessons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: TARGET_NOT_UNIQUE | Column: course_lessons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_lesson_progress_lesson_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_lessons_module_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') THEN
        RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_lessons';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id') THEN
        RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_lessons.module_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: MISSING_TARGET_TABLE | Table: course_modules';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: MISSING_TARGET_COLUMN | Column: course_modules.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_lessons.module_id', v_source_type, 'course_modules.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.course_modules')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: TARGET_NOT_UNIQUE | Column: course_modules.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_lessons_module_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_module_forum_posts_module_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_module_forum_posts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_module_forum_posts.module_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: MISSING_TARGET_TABLE | Table: course_modules';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: MISSING_TARGET_COLUMN | Column: course_modules.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_module_forum_posts.module_id', v_source_type, 'course_modules.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.course_modules')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: TARGET_NOT_UNIQUE | Column: course_modules.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_module_forum_posts_module_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_module_forum_posts_parent_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_module_forum_posts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id') THEN
        RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_module_forum_posts.parent_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: MISSING_TARGET_TABLE | Table: course_module_forum_posts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: MISSING_TARGET_COLUMN | Column: course_module_forum_posts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_module_forum_posts.parent_id', v_source_type, 'course_module_forum_posts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.course_module_forum_posts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: TARGET_NOT_UNIQUE | Column: course_module_forum_posts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_module_forum_posts_parent_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_modules_course_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_modules_course_id_fkey') THEN
        RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') THEN
        RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_modules';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id') THEN
        RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_modules.course_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: MISSING_TARGET_TABLE | Table: courses';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: MISSING_TARGET_COLUMN | Column: courses.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_modules.course_id', v_source_type, 'courses.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.courses')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: TARGET_NOT_UNIQUE | Column: courses.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_modules_course_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_work_submissions_course_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_work_submissions') THEN
        RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_work_submissions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id') THEN
        RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_work_submissions.course_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: MISSING_TARGET_TABLE | Table: courses';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: MISSING_TARGET_COLUMN | Column: courses.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_work_submissions.course_id', v_source_type, 'courses.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.courses')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: TARGET_NOT_UNIQUE | Column: courses.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_work_submissions_course_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando courses_sala_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_sala_id_fkey') THEN
        RAISE NOTICE 'FK: courses_sala_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        RAISE NOTICE 'FK: courses_sala_id_fkey | Status: MISSING_SOURCE_TABLE | Table: courses';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id') THEN
        RAISE NOTICE 'FK: courses_sala_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: courses.sala_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: courses_sala_id_fkey | Status: MISSING_TARGET_TABLE | Table: salas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: courses_sala_id_fkey | Status: MISSING_TARGET_COLUMN | Column: salas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: courses_sala_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'courses.sala_id', v_source_type, 'salas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.salas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: courses_sala_id_fkey | Status: TARGET_NOT_UNIQUE | Column: salas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: courses_sala_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando custom_oracle_cards_custom_oracle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards') THEN
        RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: custom_oracle_cards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id') THEN
        RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: custom_oracle_cards.custom_oracle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: MISSING_TARGET_TABLE | Table: custom_oracles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: custom_oracles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'custom_oracle_cards.custom_oracle_id', v_source_type, 'custom_oracles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.custom_oracles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: custom_oracles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: custom_oracle_cards_custom_oracle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando cycle_books_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: cycle_books';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: cycle_books.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'cycle_books.book_id', v_source_type, 'books.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.books')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: cycle_books_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando cycle_books_cycle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: cycle_books';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id') THEN
        RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: cycle_books.cycle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: MISSING_TARGET_TABLE | Table: cycles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: cycles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'cycle_books.cycle_id', v_source_type, 'cycles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.cycles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: cycles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: cycle_books_cycle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando decodificacao_onirica_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: decodificacao_onirica';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: decodificacao_onirica.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'decodificacao_onirica.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: decodificacao_onirica_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando decodificacao_onirica_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: decodificacao_onirica';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: decodificacao_onirica.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'decodificacao_onirica.session_case_id', v_source_type, 'session_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.session_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: decodificacao_onirica_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando diagnostico_ego_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diagnostico_ego_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'diagnostico_ego') THEN
        RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: diagnostico_ego';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: diagnostico_ego.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'diagnostico_ego.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: diagnostico_ego_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando district_state_changes_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: district_state_changes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: district_state_changes.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'district_state_changes.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: district_state_changes_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando district_state_changes_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: district_state_changes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: district_state_changes.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'district_state_changes.district_id', v_source_type, 'districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.districts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: district_state_changes_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando dreams_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        RAISE NOTICE 'FK: dreams_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        RAISE NOTICE 'FK: dreams_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: dreams';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: dreams_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: dreams.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: dreams_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: dreams_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: dreams_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'dreams.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: dreams_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: dreams_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando dreams_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        RAISE NOTICE 'FK: dreams_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        RAISE NOTICE 'FK: dreams_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: dreams';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: dreams_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: dreams.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: dreams_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: dreams_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: dreams_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'dreams.session_id', v_source_type, 'sessions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sessions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: dreams_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: dreams_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando email_logs_user_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs') THEN
        RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: MISSING_SOURCE_TABLE | Table: email_logs';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id') THEN
        RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: email_logs.user_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'email_logs.user_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.profiles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: email_logs_user_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando eneagrama_feminino_afirmacoes_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: eneagrama_feminino_afirmacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: eneagrama_feminino_afirmacoes.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: eneagrama_feminino_arquetipos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: eneagrama_feminino_arquetipos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'eneagrama_feminino_afirmacoes.arquetipo_id', v_source_type, 'eneagrama_feminino_arquetipos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.eneagrama_feminino_arquetipos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: eneagrama_feminino_arquetipos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: eneagrama_feminino_afirmacoes_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando eneagrama_feminino_orientacoes_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: eneagrama_feminino_orientacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: eneagrama_feminino_orientacoes.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: eneagrama_feminino_arquetipos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: eneagrama_feminino_arquetipos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'eneagrama_feminino_orientacoes.arquetipo_id', v_source_type, 'eneagrama_feminino_arquetipos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.eneagrama_feminino_arquetipos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: eneagrama_feminino_arquetipos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: eneagrama_feminino_orientacoes_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando eneagrama_feminino_registros_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: eneagrama_feminino_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: eneagrama_feminino_registros.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'eneagrama_feminino_registros.session_case_id', v_source_type, 'session_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.session_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: eneagrama_feminino_registros_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando escrita_nao_censurada_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escrita_nao_censurada_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada') THEN
        RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: escrita_nao_censurada';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: escrita_nao_censurada.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'escrita_nao_censurada.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: escrita_nao_censurada_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando estudio_projetos_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudio_projetos') THEN
        RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: estudio_projetos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: estudio_projetos.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'estudio_projetos.book_id', v_source_type, 'books.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.books')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: estudio_projetos_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando estudos_caso_respostas_estudo_caso_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas') THEN
        RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: MISSING_SOURCE_TABLE | Table: estudos_caso_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id') THEN
        RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: estudos_caso_respostas.estudo_caso_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: MISSING_TARGET_TABLE | Table: estudos_caso';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: MISSING_TARGET_COLUMN | Column: estudos_caso.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'estudos_caso_respostas.estudo_caso_id', v_source_type, 'estudos_caso.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.estudos_caso')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: TARGET_NOT_UNIQUE | Column: estudos_caso.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: estudos_caso_respostas_estudo_caso_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando exercise_responses_exercise_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_exercise_id_fkey') THEN
        RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_responses') THEN
        RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: MISSING_SOURCE_TABLE | Table: exercise_responses';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id') THEN
        RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: exercise_responses.exercise_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: MISSING_TARGET_TABLE | Table: exercises';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: MISSING_TARGET_COLUMN | Column: exercises.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'exercise_responses.exercise_id', v_source_type, 'exercises.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.exercises')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: TARGET_NOT_UNIQUE | Column: exercises.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: exercise_responses_exercise_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando exercises_lesson_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercises_lesson_id_fkey') THEN
        RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') THEN
        RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: MISSING_SOURCE_TABLE | Table: exercises';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id') THEN
        RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: exercises.lesson_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: MISSING_TARGET_TABLE | Table: lessons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: MISSING_TARGET_COLUMN | Column: lessons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'exercises.lesson_id', v_source_type, 'lessons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.lessons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: TARGET_NOT_UNIQUE | Column: lessons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: exercises_lesson_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando ferramenta_registros_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: ferramenta_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: ferramenta_registros.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'ferramenta_registros.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: ferramenta_registros_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando ferramenta_registros_ferramenta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: ferramenta_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id') THEN
        RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: ferramenta_registros.ferramenta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'ferramenta_registros.ferramenta_id', v_source_type, 'sala_ferramentas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: ferramenta_registros_ferramenta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando fk_big5_caso
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        RAISE NOTICE 'FK: fk_big5_caso | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_registros') THEN
        RAISE NOTICE 'FK: fk_big5_caso | Status: MISSING_SOURCE_TABLE | Table: big5_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id') THEN
        RAISE NOTICE 'FK: fk_big5_caso | Status: MISSING_SOURCE_COLUMN | Column: big5_registros.caso_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: fk_big5_caso | Status: MISSING_TARGET_TABLE | Table: casos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: fk_big5_caso | Status: MISSING_TARGET_COLUMN | Column: casos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: fk_big5_caso | Status: TYPE_MISMATCH | % (%) vs % (%)', 'big5_registros.caso_id', v_source_type, 'casos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.casos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: fk_big5_caso | Status: TARGET_NOT_UNIQUE | Column: casos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: fk_big5_caso | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando fk_eneagrama_caso
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        RAISE NOTICE 'FK: fk_eneagrama_caso | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_registros') THEN
        RAISE NOTICE 'FK: fk_eneagrama_caso | Status: MISSING_SOURCE_TABLE | Table: eneagrama_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id') THEN
        RAISE NOTICE 'FK: fk_eneagrama_caso | Status: MISSING_SOURCE_COLUMN | Column: eneagrama_registros.caso_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: fk_eneagrama_caso | Status: MISSING_TARGET_TABLE | Table: casos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: fk_eneagrama_caso | Status: MISSING_TARGET_COLUMN | Column: casos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: fk_eneagrama_caso | Status: TYPE_MISMATCH | % (%) vs % (%)', 'eneagrama_registros.caso_id', v_source_type, 'casos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.casos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: fk_eneagrama_caso | Status: TARGET_NOT_UNIQUE | Column: casos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: fk_eneagrama_caso | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando formacao_modulos_formacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') THEN
        RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: formacao_modulos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id') THEN
        RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: formacao_modulos.formacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: formacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: formacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'formacao_modulos.formacao_id', v_source_type, 'formacoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.formacoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: formacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: formacao_modulos_formacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando founding_archetypes_distrito_principal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'founding_archetypes_distrito_principal_id_fkey') THEN
        RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') THEN
        RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: founding_archetypes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id') THEN
        RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: founding_archetypes.distrito_principal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: MISSING_TARGET_TABLE | Table: city_districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: city_districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'founding_archetypes.distrito_principal_id', v_source_type, 'city_districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.city_districts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: city_districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: founding_archetypes_distrito_principal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando gestos_integracao_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: gestos_integracao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: gestos_integracao.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'gestos_integracao.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: gestos_integracao_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando gestos_integracao_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: gestos_integracao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: gestos_integracao.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessoes_casa_maquinas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessoes_casa_maquinas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'gestos_integracao.sessao_id', v_source_type, 'sessoes_casa_maquinas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sessoes_casa_maquinas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessoes_casa_maquinas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: gestos_integracao_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_encounters_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_encounters') THEN
        RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_encounters';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_encounters.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapy_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapy_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_encounters.group_id', v_source_type, 'therapy_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapy_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapy_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_encounters_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_field_snapshots_circulo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_field_snapshots';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id') THEN
        RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_field_snapshots.circulo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'circulos_sagrados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: MISSING_TARGET_TABLE | Table: circulos_sagrados';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: circulos_sagrados.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_field_snapshots.circulo_id', v_source_type, 'circulos_sagrados.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.circulos_sagrados')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: circulos_sagrados.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_field_snapshots_circulo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_field_snapshots_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_field_snapshots';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_field_snapshots.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapeutic_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapeutic_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_field_snapshots.group_id', v_source_type, 'therapeutic_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapeutic_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_field_snapshots_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_members_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        RAISE NOTICE 'FK: group_members_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        RAISE NOTICE 'FK: group_members_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_members';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: group_members_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_members.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_members_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_members_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_members_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_members.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_members_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_members_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_members_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        RAISE NOTICE 'FK: group_members_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        RAISE NOTICE 'FK: group_members_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_members';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: group_members_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_members.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_members_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapy_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_members_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapy_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_members_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_members.group_id', v_source_type, 'therapy_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapy_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_members_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapy_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_members_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_participants_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_participants';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_participants.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_participants.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_participants_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_participants_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_participants';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_participants.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapeutic_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapeutic_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_participants.group_id', v_source_type, 'therapeutic_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapeutic_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_participants_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando group_sessions_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') THEN
        RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: group_sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: group_sessions.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapeutic_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapeutic_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'group_sessions.group_id', v_source_type, 'therapeutic_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapeutic_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: group_sessions_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando heroina_arquetipo_registros_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros') THEN
        RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: heroina_arquetipo_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: heroina_arquetipo_registros.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_arquetipos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_arquetipos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'heroina_arquetipo_registros.arquetipo_id', v_source_type, 'labirinto_arquetipos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_arquetipos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_arquetipos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: heroina_arquetipo_registros_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando heroina_cenario_registros_metafora_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_metafora_id_fkey') THEN
        RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros') THEN
        RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: MISSING_SOURCE_TABLE | Table: heroina_cenario_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id') THEN
        RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: heroina_cenario_registros.metafora_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_metaforas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_metaforas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'heroina_cenario_registros.metafora_id', v_source_type, 'labirinto_metaforas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_metaforas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_metaforas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: heroina_cenario_registros_metafora_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando heroina_fase_ativa_fase_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_fase_id_fkey') THEN
        RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa') THEN
        RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: MISSING_SOURCE_TABLE | Table: heroina_fase_ativa';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id') THEN
        RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: heroina_fase_ativa.fase_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_fases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_fases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'heroina_fase_ativa.fase_id', v_source_type, 'labirinto_fases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_fases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_fases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: heroina_fase_ativa_fase_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando heroina_ritual_registros_ritual_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_ritual_registros_ritual_id_fkey') THEN
        RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros') THEN
        RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: MISSING_SOURCE_TABLE | Table: heroina_ritual_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id') THEN
        RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: heroina_ritual_registros.ritual_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_rituais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_rituais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'heroina_ritual_registros.ritual_id', v_source_type, 'labirinto_rituais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_rituais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_rituais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: heroina_ritual_registros_ritual_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando imaginacao_ativa_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa') THEN
        RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: imaginacao_ativa';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: imaginacao_ativa.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'imaginacao_ativa.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: imaginacao_ativa_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando intervention_favorites_intervention_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intervention_favorites') THEN
        RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: MISSING_SOURCE_TABLE | Table: intervention_favorites';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id') THEN
        RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: intervention_favorites.intervention_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: MISSING_TARGET_TABLE | Table: interventions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: MISSING_TARGET_COLUMN | Column: interventions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'intervention_favorites.intervention_id', v_source_type, 'interventions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.interventions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: TARGET_NOT_UNIQUE | Column: interventions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: intervention_favorites_intervention_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando interventions_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interventions_district_id_fkey') THEN
        RAISE NOTICE 'FK: interventions_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') THEN
        RAISE NOTICE 'FK: interventions_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: interventions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: interventions_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: interventions.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: interventions_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: interventions_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: interventions_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'interventions.district_id', v_source_type, 'districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.districts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: interventions_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: interventions_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 4):';
    RAISE NOTICE 'Total analisadas nesta parte: %', v_total_analyzed;
    RAISE NOTICE 'Total já existentes (EXISTS): %', v_total_exists;
    RAISE NOTICE 'Total prontas para criar (READY_TO_CREATE): %', v_total_ready;
    RAISE NOTICE 'Bloqueadas - Tabela Origem Ausente: %', v_total_missing_source_table;
    RAISE NOTICE 'Bloqueadas - Coluna Origem Ausente: %', v_total_missing_source_column;
    RAISE NOTICE 'Bloqueadas - Tabela Referência Ausente: %', v_total_missing_target_table;
    RAISE NOTICE 'Bloqueadas - Coluna Referência Ausente: %', v_total_missing_target_column;
    RAISE NOTICE 'Bloqueadas - Incompatibilidade de Tipos: %', v_total_type_mismatch;
    RAISE NOTICE 'Bloqueadas - Referência não é Única/PK: %', v_total_target_not_unique;
    RAISE NOTICE '--------------------------------------------------';
END $$;
